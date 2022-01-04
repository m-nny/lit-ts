import { wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { ProblemKey } from '../problems/models/problems.entity';
import { ProblemsRepository } from '../problems/problems.repository';
import { UserKey } from '../users/models/users.entity';
import { UsersRepository } from '../users/users.repository';
import { GradingStatus } from './models/grading.status';
import { CreateSolution, SolutionEntity, SolutionKey, UpdateSolution } from './models/solutions.entity';
import { SolutionsRepository } from './solutions.repository';

@Injectable()
export class SolutionsService {
  constructor(
    private readonly repo: SolutionsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly problemRepo: ProblemsRepository
  ) {}

  async findOne(key: SolutionKey): Promise<SolutionEntity | null> {
    const item = await this.repo.findOne(instanceToPlain(key));
    return item;
  }

  async findAll(): Promise<[SolutionEntity[], number]> {
    const [items, count] = await this.repo.findAndCount({});
    return [items, count];
  }

  async create(dto: CreateSolution, authorKey: UserKey, problemKey: ProblemKey, flush = true): Promise<SolutionEntity> {
    const author = await this.usersRepo.findOneOrFail(instanceToPlain(authorKey));
    const problem = await this.problemRepo.findOneOrFail(instanceToPlain(problemKey));

    const item = SolutionEntity.fromPojo(dto);
    item.author = author;
    item.problem = problem;
    this.repo.persist(item);

    if (flush) {
      await this.repo.flush();
    }
    return item;
  }

  // FIXME(m-nny): there should be a more proper way of creating multiple items
  async createMultiple(dtos: CreateSolution[], authorKey: UserKey, problemKey: ProblemKey): Promise<SolutionEntity[]> {
    const items = await Promise.all(dtos.map((item) => this.create(item, authorKey, problemKey, false)));
    await this.repo.flush();
    return items;
  }

  async upsert(dto: CreateSolution, authorKey: UserKey, problemKey: ProblemKey, flush = true): Promise<SolutionEntity> {
    const { id } = dto;
    let item;
    if (id) {
      item = await this.repo.findOne({ id });
    }

    if (!item) {
      item = await this.create(dto, authorKey, problemKey, false);
    } else {
      wrap(item).assign(instanceToPlain(dto));
    }

    if (flush) {
      await this.repo.flush();
    }

    return item;
  }

  async upsertMultiple(dtos: CreateSolution[], authorKey: UserKey, problemKey: ProblemKey): Promise<SolutionEntity[]> {
    const items = await Promise.all(dtos.map((item) => this.upsert(item, authorKey, problemKey, false)));
    await this.repo.flush();
    return items;
  }

  async update(key: SolutionKey, dto: UpdateSolution): Promise<SolutionEntity> {
    const item = await this.repo.findOne(key);

    if (!item) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { id: 'Solution does not exist' },
        },
        HttpStatus.NOT_FOUND
      );
    }

    wrap(item).assign(instanceToPlain(dto));
    await this.repo.flush();

    return item;
  }

  async gradeSolution(solutionKey: SolutionKey, force = false): Promise<SolutionEntity> {
    console.log({ solutionKey });
    const item = await this.repo.findOne(instanceToPlain(solutionKey), ['problem']);
    if (!item) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { id: 'Solution does not exist' },
        },
        HttpStatus.NOT_FOUND
      );
    }
    if (!force && item.gradingStatus !== GradingStatus.InQueue) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { gradingStatus: 'Solution is already processed or currently in progress' },
        },
        HttpStatus.BAD_REQUEST
      );
    }
    item.gradingStatus = GradingStatus.Processing;
    await this.repo.flush();

    item.gradingResult = 'incorrect';
    if (item.body === item.problem.solution) {
      item.gradingResult = 'correct';
    }
    item.gradingStatus = GradingStatus.Finished;
    await this.repo.flush();
    return item;
  }
}
