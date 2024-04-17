// Configuration and libraries
import { ConfigModule } from '@nestjs/config';
import configuration from '../configuration/configuration';
import { Module } from '@nestjs/common';

// JWT
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigFactory } from '../configuration/jwt.config';

// Modules
import { PassportModule } from '@nestjs/passport';
import { HashModule } from '../utils/hash/hash.module';
import { UsersModule } from '../users/users.module';

// Controllers, guards, and services
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Strategies
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({ useClass: JwtConfigFactory }),
    HashModule,
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtConfigFactory],
})
export class AuthModule {}
