/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { UserKey } from '../users/models/users.entity';
import { UsersRepository } from '../users/users.repository';
import { CreateProblem, ProblemEntity, ProblemKey } from './models/problems.entity';
import { ProblemsRepository } from './problems.repository';
import { ProblemsService } from './problems.service';

const moduleMocker = new ModuleMocker(global);

describe('ProblemsService', () => {
  let problemsRepo: jest.Mocked<ProblemsRepository>;
  let problemsService: ProblemsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ProblemsService],
    })
      .useMocker((token) => {
        if (token === ProblemsRepository) {
          return {
            persist: jest.fn(),
            flush: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          } as Partial<ProblemsRepository>;
        }
        if (token === UsersRepository) {
          return {
            findOneOrFail: jest.fn((item) => item as any),
          } as Partial<UsersRepository>;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    problemsRepo = moduleRef.get(ProblemsRepository);
    problemsService = moduleRef.get(ProblemsService);
  });

  it('should be defined', () => {
    expect(problemsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new problem', async () => {
      const problemDto: CreateProblem = { id: 1, title: 'P = NP', solution: 'maybe' };
      const problemAuthor: UserKey = { username: 'jane_doe' };

      const problem = await problemsService.create(problemDto, problemAuthor);

      expect(problem).toMatchObject(problemDto);
      expect(problem?.author).toMatchObject(problemAuthor);
      expect(problemsRepo.persist).toHaveBeenCalled();
      expect(problemsRepo.flush).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should find all problems', async () => {
      const problems = ProblemEntity.fromPojos([
        { id: 1, title: 'P = NP', solution: 'maybe' },
        { id: 2, title: 'n factorial', solution: 'maybe' },
      ]);
      problemsRepo.findAll.mockReturnValue(problems as any);

      const result = await problemsService.findAll();
      expect(result[0]).toContainEqual(expect.objectContaining({ id: 1, title: 'P = NP' }));
      expect(problemsRepo.findAll).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should find a problem', async () => {
      const problem = ProblemEntity.fromPojo({ id: 1, title: 'P = NP', solution: 'maybe' });
      const problemKey: ProblemKey = { id: problem.id };
      problemsRepo.findOne.mockReturnValue(problem as any);

      const result = await problemsService.findOne(problemKey);

      expect(result).toMatchObject(problem);
      expect(problemsRepo.findOne).toHaveBeenCalled();
    });
  });
});
