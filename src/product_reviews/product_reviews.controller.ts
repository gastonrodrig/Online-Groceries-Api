import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductReviewsService } from './product_reviews.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';

@Controller('product-reviews')
@ApiTags('Product Reviews')
export class ProductReviewsController {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Post()
  createProductReview(@Body() dto: CreateProductReviewDto) {
    return this.productReviewsService.createProductReview(dto);
  }

  @Get()
  getAllProductReviews() {
    return this.productReviewsService.getAllUserFavorite();
  }

  @Patch(':id')
  updateProductReview(@Param('id') id: string, @Body() dto: UpdateProductReviewDto) {
    return this.productReviewsService.updateProductReview(id, dto);
  }

  @Delete(':id')
  deleteProductReview(@Param('id') id: string) {
    return this.productReviewsService.deleteProductReview(id);
  }
}
