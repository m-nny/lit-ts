import { wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { CreateUser, UpdateUser, UserEntity } from './models/users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async findOne(username: string): Promise<UserEntity | null> {
    const item = await this.repo.findOne({ username: username });
    return item;
  }

  async findAll(): Promise<[UserEntity[], number]> {
    const items = await this.repo.findAll();
    return [items, items.length];
  }

  async create(dto: CreateUser, flush = true): Promise<UserEntity> {
    //const { username } = dto;
    //const exists = await this.repo.count({ username });

    //if (exists > 0) {
    //throw new BadRequestException({
    //message: 'Input data validation failed',
    //errors: { username: 'Username must be unique.' },
    //});
    //}

    const item = new UserEntity(dto);

    this.repo.persist(item);
    if (flush) {
      await this.repo.flush();
    }
    return item;
  }

  // FIXME(m-nny): there should be a more proper way of creating multiple items
  async createMultiple(dtos: CreateUser[]): Promise<UserEntity[]> {
    const items = await Promise.all(
      dtos.map((item) => this.create(item, false))
    );
    await this.repo.flush();
    return items;
  }

  async upsert(dto: CreateUser, flush = true): Promise<UserEntity> {
    const { username } = dto;
    let item = await this.repo.findOne({ username });

    if (item === null) {
      item = new UserEntity(dto);
      this.repo.persist(item);
    } else {
      wrap(item).assign(instanceToPlain(dto));
    }

    if (flush) {
      await this.repo.flush();
    }

    return item;
  }

  async upsertMultiple(dtos: CreateUser[]): Promise<UserEntity[]> {
    const items = await Promise.all(
      dtos.map((item) => this.upsert(item, false))
    );
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
