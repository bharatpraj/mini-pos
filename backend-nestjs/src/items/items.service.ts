import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);
  private readonly collection = 'items'; // Collection name in Firestore

  constructor(private fb: FirebaseService) {}

  // Create an item in Firestore
  async create(dto: CreateItemDto) {
    const now = new Date();
    const plainDto = { ...dto, createdAt: now, updatedAt: now }; // Flatten the DTO if necessary
    const docRef = await this.fb.firestore
      .collection(this.collection)
      .add(plainDto);

    const item = { id: docRef.id, ...(await docRef.get()).data() };
    return item; // Return the created item
  }

  // Get all items from Firestore
  async findAll() {
    const snapshot = await this.fb.firestore
      .collection(this.collection)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}
