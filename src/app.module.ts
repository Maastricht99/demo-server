import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { BidModule } from './bid/bid.module';
import { PriceCalculationModule } from './price-calculation/price-calculation.module';

@Module({
  imports: [AuthModule, ProductModule, BidModule, PriceCalculationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
