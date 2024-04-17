// NestJS Core
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';

// Services and DTOs
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

// Custom decorators and entities
import { AuthUser, AuthUserId } from 'src/utils/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

// Guards
import { JwtGuard } from 'src/utils/guards/jwt.guard';

// Filters and interceptors
import { PasswordInterceptor } from 'src/utils/interceptors/password.interceptor';

// Swagger
import { ApiTags } from '@nestjs/swagger';
import { swaggerTags } from 'src/configuration/swagger-tags';

@ApiTags(swaggerTags.wishes)
@UseInterceptors(PasswordInterceptor)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@AuthUser() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishService.createWish(createWishDto, user);
  }

  @Get('last')
  async findLastWishes() {
    return this.wishService.findLastWishes();
  }

  @Get('top')
  async findPopWishes() {
    return this.wishService.findPopWishes();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishById(@Param('id', ParseIntPipe) id: number) {
    return this.wishService.findWishById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWish(
    @Param('id') wishId: number,
    @AuthUserId() userId: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishService.updateWish(wishId, userId, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @UsePipes(ParseIntPipe)
  async deleteWish(
    @Param('id', ParseIntPipe) id: number,
    @AuthUserId() userId: number,
  ) {
    return this.wishService.deleteWish(id, userId);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: User,
  ) {
    return this.wishService.copyWish(id, user);
  }
}
