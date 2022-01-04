import { wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { CreateUser, UpdateUser, UserEntity, UserKey } from './models/users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async findOne(key: UserKey): Promise<UserEntity | null> {
    const item = await this.repo.findOne(instanceToPlain(key));
    return item;
  }

  async findAll(): Promise<[UserEntity[], number]> {
    const items = await this.repo.findAll();
    return [items, items.length];
  }

  async create(dto: CreateUser, flush = true): Promise<UserEntity> {
    const item = UserEntity.fromPojo(dto);

    this.repo.persist(item);
    if (flush) {
      await this.repo.flush();
    }
    return item;
  }

  // FIXME(m-nny): there should be a more proper way of creating multiple items
  async createMultiple(dtos: CreateUser[]): Promise<UserEntity[]> {
    const items = await Promise.all(dtos.map((item) => this.create(item, false)));
    await this.repo.flush();
    return items;
  }

  async upsert(dto: CreateUser, flush = true): Promise<UserEntity> {
    const { username } = dto;
    let item = await this.repo.findOne({ username });

    if (item === null) {
      item = await this.create(dto, false);
    } else {
      wrap(item).assign(instanceToPlain(dto));
    }

    if (flush) {
      await this.repo.flush();
    }

    return item;
  }

  async upsertMultiple(dtos: CreateUser[]): Promise<UserEntity[]> {
    const items = await Promise.all(dtos.map((item) => this.upsert(item, false)));
    await this.repo.flush();
    return items;
  }

  async update(username: string, dto: UpdateUser): Promise<UserEntity> {
    const item = await this.repo.findOne({ username });

    if (item === null) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'User does not exist' },
        },
        HttpStatus.NOT_FOUND
      );
    }

    wrap(item).assign(instanceToPlain(dto));
    await this.repo.flush();

    return item;
  }
}
