import { PartialType } from '@nestjs/swagger';
import { CreateNutritionDto } from './create-nutrition.dto';

export class UpdateNutritionDto extends PartialType(CreateNutritionDto) {}
