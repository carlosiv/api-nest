import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDetails } from './user.details.interface';
import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}

  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }
  _getLoggedUser(user: UserDocument): Omit<UserDetails, 'password'> {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async create(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<UserDocument> {
    const user = new this.userModel({ name, email, password: hashedPassword });
    return await user.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? this._getUserDetails(user) : null;
  }

  async findByName(name: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ name: name }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async update(
    id: string,
    newName: string,
    newEmail: string,
    newHashedPassword: string,
  ): Promise<UserDocument> {
    let existingUser = await this.userModel.findById(id).exec();

    if (existingUser) {
      existingUser.name = newName ?? existingUser.name;
      existingUser.email = newEmail ?? existingUser.email;
      existingUser.password = newHashedPassword ?? existingUser.password;
      return await existingUser.save();
    }
  }

  async delete(id: string): Promise<UserDocument> {
    return await this.userModel.findByIdAndRemove(id);
  }
}
