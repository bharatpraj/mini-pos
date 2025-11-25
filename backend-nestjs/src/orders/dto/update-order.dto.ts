import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export const ORDER_STATUSES = [
  'Pending',
  'InProgress',
  'Ready',
  'Completed',
  'Cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export class UpdateOrderDto {
  @ApiPropertyOptional({
    example: 'completed',
    description: 'Order status (Pending, InProgress, Completed, Cancelled)',
  })
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @IsIn(ORDER_STATUSES as any)
  readonly status: OrderStatus;

  @IsString()
  @IsOptional()
  readonly updatedBy?: string;
}
