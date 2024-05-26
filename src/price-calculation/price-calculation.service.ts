import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuctionGateaway } from 'src/auction/auction.gateaway';
import { ProductStatus } from 'src/product/enum/product-status';
import { Product } from 'src/product/product.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class PriceCalculationService {
  constructor(
    private readonly manager: EntityManager,
    private readonly auctionGateaway: AuctionGateaway,
  ) {}

  @OnEvent('product.created')
  async handleProductCreated(payload: any) {
    // Simulate long running asynchronous process
    await new Promise((res) => setTimeout(res, 20000));

    const randomPrice = Math.floor(Math.random() * 100);

    const product = await this.manager.findOneBy(Product, {
      id: payload.productId,
    });

    product.currentPrice = randomPrice;
    product.status = ProductStatus.AUCTIONED;

    await this.manager.save(Product, product);

    await this.auctionGateaway.handleNewProductAdded(product.id);
  }
}
