import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { NewUserDto } from 'src/user/dtos/new-user.dto';
import { UserDetails } from 'src/user/user.details.interface';
import { ExistingUserDto } from 'src/user/dtos/existing-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async registerUser(
    user: Readonly<NewUserDto>,
  ): Promise<UserDetails | null | string> {
    const { name, email, password } = user;
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      return 'Email already exists';
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.create(name, email, hashedPassword);

    return this.userService._getUserDetails(newUser);
  }

  async loginUser(
    existingProduct: ExistingUserDto,
  ): Promise<{ token: string } | null | string> {
    const { email, password } = existingProduct;

    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser) {
      return 'Invalid credentials';
    }

    const isPasswordValid = await this.comparePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return 'Invalid credentials';
    }

    const jwt = await this.jwtService.sign({
      existingUser,
    });

    return { token: jwt };
  }
}
