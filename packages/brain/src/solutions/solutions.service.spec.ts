/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { ProblemKey } from '../problems/models/problems.entity';
import { ProblemsRepository } from '../problems/problems.repository';
import { UserKey } from '../users/models/users.entity';
import { UsersRepository } from '../users/users.repository';
import { CreateSolution, SolutionEntity, SolutionKey } from './models/solutions.entity';
import { SolutionsRepository } from './solutions.repository';
import { SolutionsService } from './solutions.service';

const moduleMocker = new ModuleMocker(global);

describe('SolutionsService', () => {
  let solutionsRepo: jest.Mocked<SolutionsRepository>;
  let solutionsService: SolutionsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SolutionsService],
    })
      .useMocker((token) => {
        if (token === SolutionsRepository) {
          return {
            persist: jest.fn(),
            flush: jest.fn(),
            findAll: jest.fn(),
            findAndCount: jest.fn(),
            findOne: jest.fn(),
          } as Partial<SolutionsRepository>;
        }
        if (token === UsersRepository) {
          return {
            findOneOrFail: jest.fn((item) => item as any),
          } as Partial<UsersRepository>;
        }
        if (token === ProblemsRepository) {
          return {
            findOneOrFail: jest.fn((item) => item as any),
          } as Partial<ProblemsRepository>;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    solutionsRepo = moduleRef.get(SolutionsRepository);
    solutionsService = moduleRef.get(SolutionsService);
  });

  it('should be defined', () => {
    expect(solutionsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new solution', async () => {
      const solutionDto: CreateSolution = { id: 10, body: 'maybe' };
      const authorKey: UserKey = { username: 'jane_doe' };
      const problemKey: ProblemKey = { id: 1 };

      const solution = await solutionsService.create(solutionDto, authorKey, problemKey);

      expect(solution).toMatchObject(solutionDto);
      expect(solution?.author).toMatchObject(authorKey);
      expect(solution?.problem).toMatchObject(problemKey);
      expect(solutionsRepo.persist).toHaveBeenCalled();
      expect(solutionsRepo.flush).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should find all solutions', async () => {
      const solutions = SolutionEntity.fromPojos([
        { id: 10, body: 'maybe' },
        { id: 20, body: 'idk' },
      ]);
      solutionsRepo.findAndCount.mockReturnValue([solutions, solutions.length] as any);

      const result = await solutionsService.findAll();

      expect(result[0]).toContainEqual(expect.objectContaining({ id: 10, body: 'maybe' }));
      expect(solutionsRepo.findAndCount).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should find a solution', async () => {
      const solution = SolutionEntity.fromPojo({ id: 10, body: 'maybe' });
      const solutionKey: SolutionKey = { id: solution.id };
      solutionsRepo.findOne.mockReturnValue(solution as any);

      const result = await solutionsService.findOne(solutionKey);

      expect(result).toMatchObject(solution);
      expect(solutionsRepo.findOne).toHaveBeenCalled();
    });
  });
});
