import { wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { UserKey } from '../users/models/users.entity';
import { UsersRepository } from '../users/users.repository';
import { CreateProblem, ProblemEntity, ProblemKey, UpdateProblem } from './models/problems.entity';
import { ProblemsRepository } from './problems.repository';

@Injectable()
export class ProblemsService {
  constructor(private readonly repo: ProblemsRepository, private readonly usersRepo: UsersRepository) {}

  async findOne(key: ProblemKey): Promise<ProblemEntity | null> {
    const item = await this.repo.findOne(key);
    return item;
  }

  async findAll(): Promise<[ProblemEntity[], number]> {
    const items = await this.repo.findAll();
    return [items, items.length];
  }

  async create(dto: CreateProblem, authorKey: UserKey, flush = true): Promise<ProblemEntity> {
    const author = await this.usersRepo.findOneOrFail(instanceToPlain(authorKey));

    const item = ProblemEntity.fromPojo(dto);
    item.author = author;
    this.repo.persist(item);

    if (flush) {
      await this.repo.flush();
    }
    return item;
  }

  // FIXME(m-nny): there should be a more proper way of creating multiple items
  async createMultiple(dtos: CreateProblem[], authorKey: UserKey): Promise<ProblemEntity[]> {
    const items = await Promise.all(dtos.map((item) => this.create(item, authorKey, false)));
    await this.repo.flush();
    return items;
  }

  async upsert(dto: CreateProblem, authorKey: UserKey, flush = true): Promise<ProblemEntity> {
    const { id } = dto;
    let item = await this.repo.findOne({ id });

    if (item === null) {
      item = await this.create(dto, authorKey, false);
    } else {
      wrap(item).assign(instanceToPlain(dto));
    }

    if (flush) {
      await this.repo.flush();
    }

    return item;
  }

  async upsertMultiple(dtos: CreateProblem[], authorKey: UserKey): Promise<ProblemEntity[]> {
    const items = await Promise.all(dtos.map((item) => this.upsert(item, authorKey, false)));
    await this.repo.flush();
    return items;
  }

  async update(key: ProblemKey, dto: UpdateProblem): Promise<ProblemEntity> {
    const item = await this.repo.findOne(key);

    if (item === null) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'Problem does not exist' },
        },
        HttpStatus.NOT_FOUND
      );
    }

    wrap(item).assign(instanceToPlain(dto));
    await this.repo.flush();

    return item;
  }
}
