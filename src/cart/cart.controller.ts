import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCartDto } from './dto/update-quantity.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  createCartItem(@Body() dto: CreateCartDto) {
    return this.cartService.createCartItem(dto);
  }

  @Get()
  getAllCartItems() {
    return this.cartService.getAllCartItems();
  }

  @Get('is-in-cart/:userId/:productId')
  isInCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.isInCart(userId, productId);
  }

  @Get('user/:userId')
  getCartItemsByUserId(@Param('userId') userId: string) {
    return this.cartService.getCartItemsByUserId(userId);
  }

  @Delete('user/:userId/product/:productId')
  deleteCartItemByUserAndProductId(
    @Param('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.deleteCartItemByUserAndProductId(userId, productId);
  }

  @Patch('increase/:userId/:productId')
  increaseCartQuantity(
    @Param('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.increaseCartQuantity(userId, productId);
  }

  @Patch('decrease/:userId/:productId')
  decreaseCartQuantity(
    @Param('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.decreaseCartQuantity(userId, productId);
  }

  @Patch('add-multiple/:userId/:productId')
  addMultipleQuantity(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartDto
  ) {
    return this.cartService.addMultipleQuantity(userId, productId, dto);
  }
}
