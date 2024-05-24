import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { BidModule } from './bid/bid.module';
import { PriceCalculationModule } from './price-calculation/price-calculation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
import { Product } from './product/product.entity';
import { Bid } from './bid/bid.entity';
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: "postgres",
          host: configService.get<string>("DB_HOST"),
          port: +configService.get<string>("DB_PORT"),
          username: configService.get<string>("DB_USER"),
          password: configService.get<string>("DB_PASSWORD"),
          database: configService.get<string>("DB_NAME"),
          entities: [User, Product, Bid],
          synchronize: true,
        }
      },
      inject: [ConfigService]
    }),
    AuthModule, 
    ProductModule, 
    BidModule, 
    PriceCalculationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
