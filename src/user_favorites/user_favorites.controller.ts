import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserFavoritesService } from './user_favorites.service';
import { CreateUserFavoriteDto } from './dto/create-user-fav.dto';

@Controller('user-favorites')
@ApiTags('User Favorites')
export class UserFavoritesController {
  constructor(private readonly userFavService: UserFavoritesService) {}

  @Post()
  createUserFavorite(@Body() createUserFavoriteDto: CreateUserFavoriteDto) {
    return this.userFavService.createUserFavorite(createUserFavoriteDto);
  }

  @Get()
  getAllUserFavorites() {
    return this.userFavService.getAllUserFavorites();
  }

  @Get('user/:userId')
  getUserFavoritesByUserId(@Param('userId') userId: string) {
    return this.userFavService.getUserFavoritesByUserId(userId);
  }

  @Get('is-favorite/:userId/:productId')
  isFavorite(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.userFavService.isFavorite(userId, productId);
  }

  @Delete('user/:userId/product/:productId')
  delete(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.userFavService.deleteUserFavoriteByUserAndProductId(userId, productId);
  }
}
