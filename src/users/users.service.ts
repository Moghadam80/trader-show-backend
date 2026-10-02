import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async onModuleInit() {
    if ((await this.users.count()) > 0) return;
    await this.users.save([
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
      { name: 'Charlie', email: 'charlie@example.com' },
      { name: 'David', email: 'david@example.com' },
    ]);
  }

  findAll() {
    return this.users.find({ order: { name: 'ASC' } });
  }

  findById(id: string) {
    return this.users.findOneBy({ id });
  }
}
