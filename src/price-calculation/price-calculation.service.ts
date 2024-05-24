import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductStatus } from 'src/product/enum/product-status';
import { Product } from 'src/product/product.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class PriceCalculationService {

    constructor(
        private readonly manager: EntityManager
    ) {};

    @OnEvent("product.created")
    async handleProductCreated(payload: any) {

        // Simulate long asynchronous background process
        await new Promise(res => setTimeout(res, 20000));
        
        const randomPrice = Math.floor(Math.random() * 100);

        const product = await this.manager.findOneBy(Product, { id: payload.productId });

        product.startingPrice = randomPrice;
        product.status = ProductStatus.AUCTIONED;

        await this.manager.save(Product, product);
    }
}
