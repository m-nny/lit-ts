/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { PartialDeep } from 'type-fest';
import { PrismaService } from '../prisma/prisma.service';
import { GradingStatus } from './models/grading.status';
import { SolutionEntity } from './models/solutions.entity';
import { SolutionsPrismaService } from './solutions.service';

const moduleMocker = new ModuleMocker(global);

const solutionsArray: SolutionEntity[] = [
  {
    id: 1,
    body: 'A+B',

    authorUsername: 'jane_doe',
    problemId: 1,

    gradingStatus: GradingStatus.InQueue,
    gradingResult: null,

    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
const oneSolution = solutionsArray[0];

const mockPrismaService: PartialDeep<PrismaService> = {
  $transaction: jest.fn((fns) => Promise.all(fns) as any),
  solution: {
    findMany: jest.fn().mockResolvedValue(solutionsArray),
    count: jest.fn().mockResolvedValue(solutionsArray.length),
    findUnique: jest.fn().mockResolvedValue(oneSolution),
    create: jest.fn(
      (item) =>
        ({
          ...item.data,
          authorUsername: item.data.author?.connect?.username,
          problemId: item.data.problem?.connect?.id,
        } as any)
    ),
    update: jest.fn().mockResolvedValue(oneSolution),
    delete: jest.fn().mockResolvedValue(oneSolution),
  },
};

describe('SolutionsPrismaService', () => {
  let service: SolutionsPrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SolutionsPrismaService],
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

    service = moduleRef.get(SolutionsPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    it('should find all solutions', async () => {
      const solutions = await service.findMany({});
      expect(solutions[0]).toEqual(solutionsArray);
      expect(solutions[1]).toEqual(solutionsArray.length);
    });
  });
  describe('findOne', () => {
    it('should find a solution', async () => {
      const solution = await service.findOne({ id: oneSolution.id });
      expect(solution).toEqual(oneSolution);
    });
  });
  describe('create', () => {
    it('should create a new solution', async () => {
      const solution = await service.create(oneSolution);
      expect(solution).toMatchObject(oneSolution);
    });
  });
  describe('updateOne', () => {
    it('should update a solution', async () => {
      const solution = await service.update({
        where: { id: oneSolution.id },
        data: { gradingStatus: GradingStatus.Done, gradingResult: 'OK' },
      });
      expect(solution).toEqual(oneSolution);
    });
  });
  describe('deleteOne', () => {
    it('should delete a solution', async () => {
      const solution = await service.delete({ id: oneSolution.id });
      expect(solution).toEqual(oneSolution);
    });
  });
});
