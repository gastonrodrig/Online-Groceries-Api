import { Module } from '@nestjs/common';
import { ProductReviewsService } from './product_reviews.service';
import { ProductReviewsController } from './product_reviews.controller';

@Module({
  providers: [ProductReviewsService],
  controllers: [ProductReviewsController]
})
export class ProductReviewsModule {}
