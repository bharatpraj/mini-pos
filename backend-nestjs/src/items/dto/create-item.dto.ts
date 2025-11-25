import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({
    example: 'Coca Cola 500ml',
    description: 'Name of the item',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'COKE-500',
    description: 'Unique SKU code of the item',
  })
  @IsString()
  sku: string;

  @ApiProperty({
    example: 25,
    description: 'Price of the item',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'https://example.com/coke.jpg',
    description: 'Image URL of the item',
  })
  @IsString()
  image: string;
}
