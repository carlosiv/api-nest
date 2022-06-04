import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ProductDocument } from './product.schema';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  createProduct(
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description?: string,
  ): Promise<ProductDocument> {
    return this.productService.create(name, price, description);
  }

  @Get()
  findAll(): Promise<ProductDocument[]> {
    return this.productService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  findOne(@Param('id') id: string): Promise<ProductDocument> {
    return this.productService.findOne(id);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description?: string,
  ): Promise<ProductDocument> {
    return this.productService.update(id, name, price, description);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<ProductDocument> {
    return this.productService.delete(id);
  }
}
