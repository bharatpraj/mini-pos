import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventsGateway } from '../websocket/events.gateway';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly collection = 'orders';
  private readonly auditCollection = 'orders_audit';

  constructor(
    private fb: FirebaseService,
    private gateway: EventsGateway,
  ) {}

  onModuleInit() {
    // run after all modules initialized
    this.listenForChanges();
  }

  /**
   * Listens for changes to the Firestore orders collection and emits events
   * to the gateway when changes are detected. The listener is only started
   * if Firestore has been initialized.
   */
  private listenForChanges() {
    if (!this.fb.firestore) {
      this.logger.warn(
        'Firestore not initialized yet — skipping listener startup.',
      );
      return;
    }

    this.fb.firestore.collection(this.collection).onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const order = { id: change.doc.id, ...change.doc.data() };
        this.gateway.emitOrder(`order_${change.type}`, order);
      });
    });

    this.logger.log('Listening for Firestore order changes...');
  }

  /**
   * Creates a new order and logs the creation in the audit collection.
   * Emits an `order_created` event to the gateway.
   *
   * @param dto The order data to create
   * @returns The created order with its new status
   */
  async create(dto: CreateOrderDto) {
    const now = new Date();
    const plainDto = instanceToPlain(dto); // Convert nested DTOs to plain objects
    const docRef = await this.fb.firestore.collection(this.collection).add({
      ...plainDto,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });
    await this.fb.firestore.collection(this.auditCollection).add({
      orderId: docRef.id,
      action: 'created',
      createdBy: dto.createdBy,
      timestamp: now,
    });

    const order = { id: docRef.id, ...(await docRef.get()).data() };
    this.gateway.emitOrder('order_created', order);
    return order;
  }

  /**
   * Fetches all orders from Firestore, sorted by creation date in descending order.
   * Returns an array of objects containing the order ID and its data.
   * @example const orders = await ordersService.findAll();
   * @returns {Promise<Order[]>}
   */
  async findAll() {
    const snapshot = await this.fb.firestore
      .collection(this.collection)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  /**
   * Updates the status of a specific order and logs the change in the audit collection.
   * Emits an `order_status_changed` event to the gateway.
   *
   * @param id The ID of the order to update
   * @param status The new status of the order
   * @param updatedBy The ID of the user who made the update (optional)
   * @returns The updated order with its new status
   */
  async updateStatus(id: string, status: string, updatedBy?: string) {
    const ref = this.fb.firestore.collection(this.collection).doc(id);
    const now = new Date();
    await ref.update({ status, updatedAt: now });

    await this.fb.firestore.collection(this.auditCollection).add({
      orderId: id,
      action: 'status_update',
      newStatus: status,
      updatedBy,
      timestamp: now,
    });

    const updated = { id, ...(await ref.get()).data() };
    this.gateway.emitOrder('order_status_changed', updated);
    return updated;
  }

  /**
   * Get all orders belonging to a specific user email
   * @param email The user email to filter orders by
   * @returns A Promise that resolves to an array of orders
   * @example getOrdersByEmail('john.doe@example.com')
   */
  async getOrdersByEmail(email: string) {
    const snapshot = await this.fb.firestore
      .collection(this.collection)
      .where('email', '==', email)
      .get();

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}
