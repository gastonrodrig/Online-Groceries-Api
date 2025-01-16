import { Controller, Post, Get, Delete, Param, Body, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserNoProviderDto } from './dto/create-user-no-provider.dto';
import { CreateUserWithProviderDto } from './dto/create-user-with-provider.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Crear usuario sin proveedor
  @Post('no-provider')
  createUserNoProvider(@Body() createUserNoProviderDto: CreateUserNoProviderDto) {
    return this.userService.createUserNoProvider(createUserNoProviderDto);
  }

  // Crear usuario con proveedor
  @Post('provider')
  createUserWithProvider(@Body() createUserWithProviderDto: CreateUserWithProviderDto) {
    return this.userService.createUserWithProvider(createUserWithProviderDto);
  }

  // Obtener usuario por Email
  @Get('email')
  getUserByEmail(@Query('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  // Obtener todos los usuarios
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // Obtener usuario por ID
  @Get(':id')
  getUserById(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
  }

  // Actualizar usuario
  @Patch(':id')
  updateUser(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  // Eliminar usuario
  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
