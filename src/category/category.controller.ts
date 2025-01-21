import { Controller, Post, Get, Delete, Param, Body, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageFile: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        description: { type: 'string' }
      },
    },
  })
  createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() productData: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(productData, file);
  }

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param('id') categoryId: string) {
    return this.categoryService.getCategoryById(categoryId);
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
        description: { type: 'string' }
      },
    },
  })
  updateCategory(
    @Param('id') productId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.updateCategory(productId, updateCategoryDto, file);
  }  

  @Delete(':id')
  deleteCategory(@Param('id') categoryId: string) {
    return this.categoryService.deleteCategory(categoryId);
  }
}
