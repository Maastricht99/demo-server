import { Module } from '@nestjs/common';
import { PriceCalculationService } from './price-calculation.service';
import { AuctionModule } from 'src/auction/auction.module';

@Module({
  providers: [PriceCalculationService],
  imports: [AuctionModule],
})
export class PriceCalculationModule {}
