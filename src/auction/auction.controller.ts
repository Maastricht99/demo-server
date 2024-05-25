import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuctionService } from './auction.service';

@Controller("/auction")
export class AuctionController {

    constructor(
        private readonly auctionService: AuctionService
    ) {}

    @Get("/products")
    async getAuctionedProducts() {
        return this.auctionService.getAuctionedProducts();
    }

    @Post("/products/:productId/bids")
    async bidOnProduct(
        @Param("productId") productId: string,
        @Body() body: { userId: string, amount: number }
    ) {
        return this.auctionService.bidOnProduct(body.userId, productId, body.amount);
    }

    @Get("/products/:productId")
    async getAuctionedProductById(@Param("productId") productId: string) {
        return this.auctionService.getAuctionedProductById(productId);
    }

    @Get("/products/:productId/bids")
    async xxx(@Param("productId") productId: string) {
        return this.auctionService.getProductBids(productId);
    }
}
