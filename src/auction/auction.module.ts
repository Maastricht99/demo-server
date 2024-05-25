import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionGateaway } from './auction.gateaway';
import { AuctionController } from './auction.controller';

@Module({
  providers: [AuctionService, AuctionGateaway],
  controllers: [AuctionController],
  exports: [AuctionGateaway]
})
export class AuctionModule {}
