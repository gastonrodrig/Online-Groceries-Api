import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }
  
  @Get()
  getAllCategories() {
      return this.productsService.getAllProducts();
  }

  @Get(':id')
  getCategoryById(@Param('id') productId: string) {
      return this.productsService.getProductById(productId);
  }

  @Patch(':id')
  updateProduct(@Param('id') productId: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(productId, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') productId: string) {
    return this.productsService.deleteProduct(productId);
  }
}