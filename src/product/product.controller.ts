import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/zod-validation.pipe';
import {
  CreateProductDto,
  CreateProductSchema,
} from './schema/create-product.schema';
import { ProductService } from './product.service';

@Controller('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getMyProducts(@Query('userId', ParseUUIDPipe) userId: string) {
    return this.productService.getMyProducts(userId);
  }

  @Post('/')
  async createProduct(
    @Body(new ZodValidationPipe(CreateProductSchema)) dto: CreateProductDto,
  ) {
    return this.productService.createProduct(dto.creatorId, dto);
  }

  @Get('/:productId')
  async getProductById(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productService.getProductById(productId);
  }
}
