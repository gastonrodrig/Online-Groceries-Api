import { Controller, Post, Body, Get, Put, Delete, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageFile: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        price: { type: 'number' },
        offer_price: { type: 'number' },
        categoryId: { type: 'string' },
        brandId: { type: 'string' },
        unit_name: { type: 'string' },
        unit_value: { type: 'number' },
        nutrition_weight: { type: 'string' },
        detail: { type: 'string' },
        is_fav: { type: 'number' },
      },
    },
  })
  createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() productData: CreateProductDto,
  ) {
    return this.productsService.createProduct(productData, file);
  }
  
  @Get()
  getAllCategories() {
      return this.productsService.getAllProducts();
  }

  @Get(':id')
  getCategoryById(@Param('id') productId: string) {
      return this.productsService.getProductById(productId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageFile: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        price: { type: 'number' },
        offer_price: { type: 'number' },
        categoryId: { type: 'string' },
        brandId: { type: 'string' },
        unit_name: { type: 'string' },
        unit_value: { type: 'number' },
        nutrition_weight: { type: 'string' },
        detail: { type: 'string' },
        is_fav: { type: 'number' },
      },
    },
  })
  updateProduct(
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.updateProduct(productId, updateProductDto, file);
  }  

  @Delete(':id')
  deleteProduct(@Param('id') productId: string) {
    return this.productsService.deleteProduct(productId);
  }
}