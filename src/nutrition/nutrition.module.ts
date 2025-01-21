import { Module } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { NutritionController } from './nutrition.controller';

@Module({
  controllers: [NutritionController],
  providers: [NutritionService]
})
export class NutritionModule {}
