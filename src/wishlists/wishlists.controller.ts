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
  UseInterceptors,
} from '@nestjs/common';

// Services and DTOs
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

// Custom guards, decorators, and entities
import { JwtGuard } from 'src/utils/guards/jwt.guard';
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

// Interceptors
import { PasswordInterceptor } from 'src/utils/interceptors/password.interceptor';

// Swagger
import { ApiTags } from '@nestjs/swagger';
import { swaggerTags } from 'src/configuration/swagger-tags';

@ApiTags(swaggerTags.wishlists)
@UseInterceptors(PasswordInterceptor)
@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthUser() user: User,
  ) {
    return this.wishlistsService.createWishlist(createWishlistDto, user);
  }

  @Get()
  async findAll() {
    return this.wishlistsService.getAllWishlists();
  }

  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.getWishlistById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user: User,
  ) {
    return this.wishlistsService.updateWishlist(id, updateWishlistDto, user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    return this.wishlistsService.removeWishlist(id, user);
  }
}
