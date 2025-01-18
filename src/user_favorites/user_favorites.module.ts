import { Module } from '@nestjs/common';
import { UserFavoritesController } from './user_favorites.controller';
import { UserFavoritesService } from './user_favorites.service';

@Module({
  controllers: [UserFavoritesController],
  providers: [UserFavoritesService],
})
export class UserFavoritesModule {}
