import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserFavoritesService } from './user_favorites.service';
import { CreateUserFavoriteDto } from './dto/create-user-fav.dto';

@Controller('user-favorites')
@ApiTags('User Favorites')
export class UserFavoritesController {
  constructor(private readonly userFavService: UserFavoritesService) {}

  @Post()
  createUserFavorites(@Body() createUserFavDto: CreateUserFavoriteDto) {
    return this.userFavService.createUserFavorite(createUserFavDto);
  }

  @Get()
  getAllUserFavorites() {
    return this.userFavService.getAllUserFavorite();
  }

  @Delete(':id')
  deleteUserFavorite(@Param('id') userFavId: string) {
    return this.userFavService.deleteUserFavorite(userFavId);
  }
}
