import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { BrandModule } from './brand/brand.module';
import { UserFavoritesModule } from './user_favorites/user_favorites.module';
import { ProductReviewsModule } from './product_reviews/product_reviews.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    UserModule,
    ProductModule, 
    CategoryModule, 
    BrandModule, 
    UserFavoritesModule, 
    ProductReviewsModule, 
    NutritionModule, CartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
