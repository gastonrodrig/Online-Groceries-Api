import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { BrandModule } from './brand/brand.module';
import { BestProductsController } from './best_products/best_products.controller';
import { BestProductsService } from './best_products/best_products.service';
import { BestProductsModule } from './best_products/best_products.module';
import { UserFavoritesController } from './user_favorites/user_favorites.controller';
import { UserFavoritesService } from './user_favorites/user_favorites.service';
import { UserFavoritesModule } from './user_favorites/user_favorites.module';
import { ProductReviewsModule } from './product_reviews/product_reviews.module';

@Module({
  imports: [
    UserModule,
    ProductModule, 
    CategoryModule, 
    BrandModule, 
    BestProductsModule, 
    UserFavoritesModule, 
    ProductReviewsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
