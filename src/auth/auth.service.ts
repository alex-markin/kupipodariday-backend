// NestJS Core and exceptions
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Services
import { UsersService } from '../users/users.service';
import { HashService } from '../utils/hash/hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async auth(userId: number) {
    const token = await this.jwtService.signAsync({ sub: userId });
    return { access_token: token };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (user && (await this.hashService.verifyHash(password, user.password))) {
      return user;
    } else {
      throw new UnauthorizedException('Username or password is invalid');
    }
  }
}
