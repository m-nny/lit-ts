/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { PartialDeep } from 'type-fest';
import { PrismaService } from '../prisma/prisma.service';
import { ProblemEntity } from './models/problems.entity';
import { ProblemsPrismaService } from './problems.service';

const moduleMocker = new ModuleMocker(global);

const problemsArray: ProblemEntity[] = [
  {
    id: 1,
    title: 'A+B',
    authorUsername: 'jane_doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
const oneProblem = problemsArray[0];

const mockPrismaService: PartialDeep<PrismaService> = {
  $transaction: jest.fn((fns) => Promise.all(fns) as any),
  problem: {
    findMany: jest.fn().mockResolvedValue(problemsArray),
    count: jest.fn().mockResolvedValue(problemsArray.length),
    findUnique: jest.fn().mockResolvedValue(oneProblem),
    create: jest.fn((item) => ({ ...item.data, authorUsername: item.data.author?.connect?.username } as any)),
    update: jest.fn().mockResolvedValue(oneProblem),
    delete: jest.fn().mockResolvedValue(oneProblem),
  },
};

describe('ProblemsPrismaService', () => {
  let service: ProblemsPrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ProblemsPrismaService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return mockPrismaService;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = moduleRef.get(ProblemsPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    it('should find all problems', async () => {
      const problems = await service.findMany({});
      expect(problems[0]).toEqual(problemsArray);
      expect(problems[1]).toEqual(problemsArray.length);
    });
  });
  describe('findOne', () => {
    it('should find a problem', async () => {
      const problem = await service.findOne({ id: oneProblem.id });
      expect(problem).toEqual(oneProblem);
    });
  });
  describe('create', () => {
    it('should create a new problem', async () => {
      const problem = await service.create(oneProblem);
      expect(problem).toMatchObject(oneProblem);
    });
  });
  describe('updateOne', () => {
    it('should update a problem', async () => {
      const problem = await service.update({
        where: { id: oneProblem.id },
        data: { title: 'another title' },
      });
      expect(problem).toEqual(oneProblem);
    });
  });
  describe('deleteOne', () => {
    it('should delete a problem', async () => {
      const problem = await service.delete({ id: oneProblem.id });
      expect(problem).toEqual(oneProblem);
    });
  });
});
