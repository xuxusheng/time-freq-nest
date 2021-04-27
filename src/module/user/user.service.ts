import { Injectable, Logger } from '@nestjs/common';

import { User } from '../shared/entitiy';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  private readonly users = [
    {
      id: 1,
      name: 'john',
      password: 'changeme',
    },
    {
      id: 2,
      name: 'xs',
      password: '1314',
    },
  ];

  create(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  findMany() {
    return `This action returns all user`;
  }

  async findOneById(id: number): Promise<User> {
    return this.users.find((user) => user.id === id);
  }

  findOneByName(name: string) {
    return this.users.find((user) => user.name === name);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  delete(id: number) {
    return `This action removes a #${id} user`;
  }
}
