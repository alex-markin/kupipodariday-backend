// NestJS Core and exceptions
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Passport strategy for local authentication
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

// Auth service
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validatePassword(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
