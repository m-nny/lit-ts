import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { GradingStatus } from './models/grading.status';
import { SolutionEntity } from './models/solutions.entity';
import { SolutionsPrismaResolver } from './solutions.resolver';
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

const mockSolutionsService: Partial<SolutionsPrismaService> = {
  findMany: jest.fn().mockResolvedValue([solutionsArray, solutionsArray.length]),
  findOne: jest.fn().mockResolvedValue(oneSolution),
  create: jest.fn().mockResolvedValue(oneSolution),
};
describe('SolutionsPrismaResolver', () => {
  let resolver: SolutionsPrismaResolver;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SolutionsPrismaResolver],
    })
      .useMocker((token) => {
        if (token === SolutionsPrismaService) {
          return mockSolutionsService;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
    resolver = moduleRef.get(SolutionsPrismaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should find solutions', async () => {
      const solutions = await resolver.findAll();

      expect(solutions?.items).toEqual(solutionsArray);
      expect(solutions?.length).toEqual(solutionsArray.length);
    });
  });

  describe('findById', () => {
    it('should find one solution', async () => {
      const solution = await resolver.findById({ id: oneSolution.id });

      expect(solution).toEqual(oneSolution);
    });
  });
  describe('create', () => {
    it('should make a new solution', async () => {
      const solution = await resolver.create(oneSolution);

      expect(solution).toEqual(oneSolution);
    });
  });
});
