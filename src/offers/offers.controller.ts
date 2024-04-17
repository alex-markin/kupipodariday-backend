// NestJS Core
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

// Offers service and DTO
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

// Custom decorators and guards
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { JwtGuard } from 'src/utils/guards/jwt.guard';

// User entity
import { User } from '../users/entities/user.entity';

// Interceptors
import { PasswordInterceptor } from 'src/utils/interceptors/password.interceptor';

// Swagger
import { ApiTags } from '@nestjs/swagger';
import { swaggerTags } from 'src/configuration/swagger-tags';

@ApiTags(swaggerTags.offers)
@UseInterceptors(PasswordInterceptor)
@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @AuthUser() user: User) {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  async findAll() {
    return this.offersService.findAllOffers();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.findOfferById(id);
  }
}
