import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order and sync to Firestore' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all orders from Firestore' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Fetch orders by email' })
  getOrdersByEmail(@Param('email') email: string) {
    return this.ordersService.getOrdersByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order status' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    if (!dto.status) throw new BadRequestException('status is required');
    return this.ordersService.updateStatus(id, dto.status, dto.updatedBy);
  }
}
