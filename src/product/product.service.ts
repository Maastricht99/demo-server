import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './schema/create-product.schema';
import { Product } from './product.entity';
import { EntityManager } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductService {
  constructor(
    private readonly manager: EntityManager,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getMyProducts(userId: string) {
    const products = await this.manager.findBy(Product, {
      creatorId: userId,
    });

    return products.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async createProduct(userId: string, dto: CreateProductDto) {
    const pictures = [
      'https://fossil.scene7.com/is/image/FossilPartners/FS6029_main?$sfcc_fos_medium$',
      'https://media.wired.com/photos/6511aab1189c419c40374c92/1:1/w_1358,h_1358,c_limit/Apple-Watch-Ultra-2-Alt-Gear.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiLEPuSGGRUeVFYsGX3ZoBDzsE4AuKeUFm5_ctaOyccg&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhzUGRk_P017NE7rMa0jHqdUmljWAmt-ZYDO0h9D4YLw&s',
    ];

    const pictureUrl = pictures[Math.floor(Math.random() * pictures.length)];

    const dummyDescription =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    const product = new Product(userId, dto.name, dummyDescription, pictureUrl);

    await this.manager.save(product);

    this.eventEmitter.emit('product.created', { productId: product.id });
  }

  async getProductById(productId: string) {
    return this.manager.findOneBy(Product, { id: productId });
  }
}
