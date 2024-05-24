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

    async getMyProducts(userId: string) {
        const products = await this.manager.findBy(Product, {
            creatorId: userId
        });

        return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async createProduct(userId: string, dto: CreateProductDto) {
        const product = new Product(
            userId,
            dto.name,
            dto.description
        );

        await this.manager.save(product);

        this.eventEmitter.emit("product.created", { productId: product.id });
    }
}
