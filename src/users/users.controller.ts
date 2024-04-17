// NestJS Core
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

// Swagger
import { ApiTags } from '@nestjs/swagger';
import { swaggerTags } from 'src/configuration/swagger-tags';

// Services and guards
import { UsersService } from './users.service';
import { JwtGuard } from 'src/utils/guards/jwt.guard';

// DTO
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

// Custom decorators and filters
import { AuthUserId } from 'src/utils/decorators/user.decorator';

@ApiTags(swaggerTags.users)
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@AuthUserId() id: number) {
    return this.usersService.findById(id);
  }

  @Get(':username')
  async findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Patch('me')
  async update(@AuthUserId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Post('find')
  async findMany(@Body() query: FindUserDto) {
    return this.usersService.findUsers(query);
  }

  @Get('me/wishes')
  async getMyWishes(@AuthUserId() id: number) {
    return this.usersService.findWishesById(id);
  }

  @Get(':username/wishes')
  async getWishesByUsername(@Param('username') username: string) {
    return this.usersService.findWishesByName(username);
  }
}
