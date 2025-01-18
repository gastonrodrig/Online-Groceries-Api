import { Controller, Post, Get, Delete, Param, Body, Patch } from '@nestjs/common';
import { BrandService } from './brand.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brand')
@ApiTags('Brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  createBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.createBrand(createBrandDto);
  }

  @Get()
  getAllBrands() {
    return this.brandService.getAllBrands();
  }

  @Get(':id')
  getBrandById(@Param('id') brandId: string) {
    return this.brandService.getBrandById(brandId);
  }

  @Patch(':id')
  updateBrand(@Param('id') brandId: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.updateBrand(brandId, updateBrandDto);
  }

  @Delete(':id')
  deleteBrand(@Param('id') brandId: string) {
    return this.brandService.deleteBrand(brandId);
  } 
}
