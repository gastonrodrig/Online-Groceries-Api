import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { StorageService } from 'src/firebase/storage.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, StorageService],
})
export class ProductModule {}