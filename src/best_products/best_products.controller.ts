import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BestProductsService } from './best_products.service';
import { CreateBestProductDto } from './dto/create-best-product.dto';

@Controller('best-products')
@ApiTags('Best Products')
export class BestProductsController {
	constructor(private readonly bestProdService: BestProductsService) {}

	@Post()
	createBestProducts(@Body() createBestProductDto: CreateBestProductDto) {
		return this.bestProdService.createBestProduct(createBestProductDto);
	}
	
	@Get()
	getAllBestProducts() {
		return this.bestProdService.getAllBestProducts();
	}

	@Delete(':id')
	deleteBestProduct(@Param('id') bestProdId: string) {
		return this.bestProdService.deleteBestProduct(bestProdId);
	}
}
