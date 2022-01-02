import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import _ from 'lodash';
import {
  CreateUser,
  UpdateUser,
  UserEntity,
  UserKey,
} from './models/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: EntityRepository<UserEntity>
  ) {}

  async findOne(username: string): Promise<UserEntity | null> {
    const item = await this.repo.findOne({ username: username });
    return item;
  }

  async findAll(): Promise<[UserEntity[], number]> {
    const items = await this.repo.findAll();
    return [items, items.length];
  }

  async create(dto: CreateUser, flush = true): Promise<UserEntity> {
    const { username } = dto;
    const exists = await this.repo.count({ username });

    if (exists > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'Username must be unique.' },
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const item = new UserEntity(dto);

    this.repo.persist(item);
    if (flush) {
      await this.repo.flush();
    }
    return item;
  }

  // NOTE(m-nny): there should be a more proper way of creating multiple items
  async createMultiple(dtos: CreateUser[]): Promise<UserEntity[]> {
    const items = await Promise.all(
      dtos.map((item) => this.create(item, false))
    );
    await this.repo.flush();
    return items;
  }

  async update(username: string, dto: UpdateUser): Promise<UserEntity> {
    dto = _.omitBy(dto, _.isUndefined);
    const item = await this.repo.findOne({ username });

    if (item == null) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'User does not exist' },
        },
        HttpStatus.NOT_FOUND
      );
    }

    wrap(item).assign({ ...dto });
    await this.repo.flush();

    return item;
  }
}
