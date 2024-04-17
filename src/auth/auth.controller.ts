// Libraries, constants, and decorators
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { swaggerTags } from 'src/configuration/swagger-tags';

// Services
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from '../utils/guards/local.guard';

// DTO
import { CreateUserDto } from '../users/dto/create-user.dto';

// Decorators and filters
import { AuthUserId } from '../utils/decorators/user.decorator';

@ApiTags(swaggerTags.auth)
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @UseGuards(LocalGuard)
  @Post('signin')
  signIn(@AuthUserId() userId: number) {
    return this.authService.auth(userId);
  }

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
