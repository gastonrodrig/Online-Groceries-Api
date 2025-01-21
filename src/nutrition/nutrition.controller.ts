import { Controller, Post, Body, Patch, Delete, Param, Get } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { CreateNutritionDto } from './dto/create-nutrition.dto';
import { UpdateNutritionDto } from './dto/update-nutrition.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('products/:productId/nutrition')
@ApiTags('Nutrition')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  // Crear un nuevo registro de nutrición para un producto
  @Post()
  createNutrition(@Param('productId') productId: string, @Body() createDto: CreateNutritionDto) {
    return this.nutritionService.createNutritionForProduct(productId, createDto);
  }

  // Obtener todos los registros de nutrición de un producto
  @Get()
  getAllNutrition(@Param('productId') productId: string) {
    return this.nutritionService.getAllNutritionOfProduct(productId);
  }

  // Actualizar un registro de nutrición existente
  @Patch(':nutritionId')
  updateNutrition(
    @Param('productId') productId: string,
    @Param('nutritionId') nutritionId: string,
    @Body() updateDto: UpdateNutritionDto
  ) {
    return this.nutritionService.updateNutritionOfProduct(productId, nutritionId, updateDto);
  }

  // Eliminar un registro de nutrición
  @Delete(':nutritionId')
  deleteNutrition(@Param('productId') productId: string, @Param('nutritionId') nutritionId: string) {
    return this.nutritionService.deleteNutritionOfProduct(productId, nutritionId);
  }
}
