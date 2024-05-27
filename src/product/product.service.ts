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
      'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw34d84041/images/Titan/Catalog/1698KM02_1.jpg?sw=800&sh=800',
      'https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d3Jpc3R3YXRjaHxlbnwwfHwwfHx8MA%3D%3D',
      'https://media.rolex.com/image/upload/v1710347640/rolexcom/new-watches/2024/main-navigation/rolex-watches-navigation-submariner-m124060-0001-10156_rsa_submariner_41_m124060_0001_carrousel_24.jpg',
      'https://www.audemarspiguet.com/content/dam/ap/com/homepage/2024/john-mayer/image_code_HP_1920x1283.jpg.transform.apfw.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgRa8w3XcoHsQD9dHNS6MfD9kQGBtpcfYiUBPr7iWwZw&s',
      'https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdhdGNoZXN8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1595923533867-ff8a01335ff9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdyaXN0d2F0Y2h8ZW58MHx8MHx8fDA%3D',
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
