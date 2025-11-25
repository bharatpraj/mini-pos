import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DeliveryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  email: string;
}

class PaymentDto {
  @ApiProperty()
  @IsString()
  method: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cardNumber?: string;
}

class OrderItemDto {
  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty()
  qty: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  image: string;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 'online',
    description: 'Order source (online or in-store)',
  })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({ example: 'Pending' })
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  createdBy: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  customerName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ type: DeliveryDto })
  @ValidateNested()
  @Type(() => DeliveryDto)
  delivery: DeliveryDto;

  @ApiProperty({ type: PaymentDto })
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  createdAt: string;

  @ApiPropertyOptional({ example: 'Urgent delivery' })
  @IsOptional()
  @IsString()
  notes?: string;
}
