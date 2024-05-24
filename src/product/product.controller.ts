import { Body, Controller, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/zod-validation.pipe';
import { CreateProductDto, CreateProductSchema } from './schema/create-product.schema';
import { ProductService } from './product.service';
import { SetProductAuctionableDto, SetProductAuctionableSchema } from './schema/set-product-auctionable.schema';

@Controller("/products")
export class ProductController {

    constructor(
        private readonly productService: ProductService
    ) {};

    @Post("/")
    async createProduct(
        @Body(new ZodValidationPipe(CreateProductSchema)) dto: CreateProductDto
    ) {
        const userId = "xxx";
        return this.productService.createProduct(userId, dto);
    }

    @Put("/:productId/auctionable")
    async setProductAuctionable(
        @Param("productId", ParseUUIDPipe) productId,
        @Body(new ZodValidationPipe(SetProductAuctionableSchema)) dto: SetProductAuctionableDto
    ) {
        return this.productService.setProductAuctionable(productId, dto);
    }
}
