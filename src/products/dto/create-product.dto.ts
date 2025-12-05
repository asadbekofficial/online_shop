import { IsNotEmpty, IsNumber, IsOptional, IsArray, IsJSON } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsOptional()
  oldPrice?: number;

  @IsOptional()
  discountPrice?: number;

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional() 
  @IsArray()
  colors?: string[];

  @IsOptional()
  specifications?: Record<string, any>;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  createdBy: number;
}