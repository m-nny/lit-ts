import { wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { CreateProblem, ProblemEntity, ProblemKey, UpdateProblem } from './models/problems.entity';
import { ProblemsRepository } from './problems.repository';

@Injectable()
export class ProblemsService {
  constructor(private readonly repo: ProblemsRepository) {}

  async findOne(key: ProblemKey): Promise<ProblemEntity | null> {
    const item = await this.repo.findOne(key);
    return item;
  }

  async findAll(): Promise<[ProblemEntity[], number]> {
    const items = await this.repo.findAll();
    return [items, items.length];
  }

  async create(dto: CreateProblem, flush = true): Promise<ProblemEntity> {
    const item = plainToClass(ProblemEntity, dto);
    this.repo.persist(item);

    if (flush) {
      await this.repo.flush();
    }
    return item;
  }

  // FIXME(m-nny): there should be a more proper way of creating multiple items
  async createMultiple(dtos: CreateProblem[]): Promise<ProblemEntity[]> {
    const items = await Promise.all(dtos.map((item) => this.create(item, false)));
    await this.repo.flush();
    return items;
  }

  async upsert(dto: CreateProblem, flush = true): Promise<ProblemEntity> {
    const { id } = dto;
    let item = await this.repo.findOne({ id });

    if (item === null) {
      item = plainToClass(ProblemEntity, dto);
      this.repo.persist(item);
    } else {
      wrap(item).assign(instanceToPlain(dto));
    }

    if (flush) {
      await this.repo.flush();
    }

    return item;
  }

  async upsertMultiple(dtos: CreateProblem[]): Promise<ProblemEntity[]> {
    const items = await Promise.all(dtos.map((item) => this.upsert(item, false)));
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
