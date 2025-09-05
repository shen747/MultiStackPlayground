import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  DeleteUserCommand,
  LoginUserCommand,
  UpdateUserCommand,
} from './commands';
import { GetAllUsersQuery, GetUserQuery } from './queries';

@Controller('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const registerUserCommand = new CreateUserCommand(
      createUserDto.email,
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.password,
    );
    return this.commandBus.execute(registerUserCommand);
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const registerUserCommand = new LoginUserCommand(
      loginUserDto.email,
      loginUserDto.password,
    );
    return this.commandBus.execute(registerUserCommand);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    const getAllUsersQueryInstance = new GetAllUsersQuery();
    return this.commandBus.execute(getAllUsersQueryInstance);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const getAllUsersQueryInstance = new GetUserQuery(id);
    return this.commandBus.execute(getAllUsersQueryInstance);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updateUserCommand = new UpdateUserCommand(
      id,
      updateUserDto.email,
      updateUserDto.firstName,
      updateUserDto.lastName,
      updateUserDto.password,
      updateUserDto.isActive,
    );
    return this.commandBus.execute(updateUserCommand);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    const deleteUserCommand = new DeleteUserCommand(id);
    return this.commandBus.execute(deleteUserCommand);
  }
}
