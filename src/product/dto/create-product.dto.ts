import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'Milk' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Price of the product', example: 10.5 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Stock of the product', example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ description: 'Category ID to which the product belongs', example: 'dairy' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: 'Description of the product', example: 'Fresh Milk' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Brand of the product', example: 'Brand A' })
  @IsString()
  brand: string;

  @ApiProperty({ description: 'Unit of measure for the product', example: 'liters' })
  @IsString()
  unit: string;
}
