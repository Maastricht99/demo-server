import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { LoginDto, LoginSchema } from './schema/login.schema';
import { EntityManager } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly manager: EntityManager) {}

  async loginOrSignup(dto: LoginDto) {
    const existingUser = await this.manager.findOneBy(User, {
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    if (existingUser) {
      return;
    }

    const newUser = new User(dto.firstName, dto.lastName);
    await this.manager.save(User, newUser);
  }
}
