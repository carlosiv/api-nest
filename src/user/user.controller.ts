import { Controller, Get, Param } from '@nestjs/common';
import { UserDetails } from './user.details.interface';
import { UserDocument } from './user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDetails | null> {
    return this.userService.findOne(id);
  }

  @Get()
  getUsers(): Promise<UserDocument[]> {
    return this.userService.findAll();
  }
}
