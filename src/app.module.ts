// Libraries
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { WishlistsModule } from './wishlists/wishlists.module';
import { WishesModule } from './wishes/wishes.module';
import { OffersModule } from './offers/offers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HashModule } from './utils/hash/hash.module';
import { WinstonModule } from 'nest-winston';

// Configuration
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration/configuration';
import { DatabaseConfigFactory } from './configuration/database.config';
import configSchema from './configuration/config-schema.config';
import { winstonConfig } from './configuration/winston.config';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: configSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useClass: DatabaseConfigFactory,
    }),
    WishlistsModule,
    WishesModule,
    OffersModule,
    UsersModule,
    AuthModule,
    HashModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
