import { Module } from '@nestjs/common';
import { BestProductsController } from './best_products.controller';
import { BestProductsService } from './best_products.service';

@Module({
  controllers: [BestProductsController],
  providers: [BestProductsService],
})
export class BestProductsModule {}