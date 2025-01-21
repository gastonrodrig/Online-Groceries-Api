import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { StorageService } from 'src/firebase/storage.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, StorageService]
})
export class CategoryModule {}
