import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './schema/create-product.schema';
import { Product } from './product.entity';
import { EntityManager } from 'typeorm';
import { SetProductAuctionableDto } from './schema/set-product-auctionable.schema';
import { ProductStatus } from './enum/product-status';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductService {

    constructor(
        private readonly manager: EntityManager,
        private readonly eventEmitter: EventEmitter2
    ) {};

    async createProduct(userId: string, dto: CreateProductDto) {
        const product = new Product(
            userId,
            dto.name,
            dto.description
        );

        await this.manager.save(product);

        this.eventEmitter.emit("product.created", { productId: product.id });
    }

    async setProductAuctionable(productId: string, dto: SetProductAuctionableDto) {
        const product = await this.manager.findOneBy(Product, { id: productId });

        product.status = ProductStatus.AUCTIONABLE;
        product.auctionDeadline = dto.deadline;

        await this.manager.save(Product, product);

        // emit websocket event
    }
}
