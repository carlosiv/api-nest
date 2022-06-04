import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(
    name: string,
    price: number,
    description: string,
  ): Promise<ProductDocument> {
    const product = new this.productModel({ name, price, description });
    return await product.save();
  }

  async findAll(): Promise<ProductDocument[]> {
    return await this.productModel.find().exec();
  }

  async findOne(id: string): Promise<ProductDocument> {
    return await this.productModel.findById(id).exec();
  }

  async update(
    id: string,
    newName: string,
    newPrice: number,
    newDescription: string,
  ): Promise<ProductDocument> {
    let existingProduct = await this.productModel.findById(id).exec();

    if (existingProduct) {
      existingProduct.name = newName ?? existingProduct.name;
      existingProduct.price = newPrice ?? existingProduct.price;
      existingProduct.description =
        newDescription ?? existingProduct.description;
      return await existingProduct.save();
    }
  }

  async delete(id: string): Promise<ProductDocument> {
    return await this.productModel.findByIdAndRemove(id);
  }

  async findByName(name: string): Promise<ProductDocument> {
    return await this.productModel.findOne({ name: name }).exec();
  }
}
