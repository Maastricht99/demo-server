import { Module } from '@nestjs/common';
import { PriceCalculationService } from './price-calculation.service';

@Module({
  providers: [PriceCalculationService]
})
export class PriceCalculationModule {}
