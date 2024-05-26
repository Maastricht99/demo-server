import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionGateaway } from './auction.gateaway';

@Module({
  providers: [AuctionService, AuctionGateaway],
  controllers: [],
  exports: [AuctionGateaway],
})
export class AuctionModule {}
