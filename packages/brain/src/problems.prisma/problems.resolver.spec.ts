import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { ProblemEntity } from './models/problems.entity';
import { ProblemsPrismaResolver } from './problems.resolver';
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

const mockProblemsService: Partial<ProblemsPrismaService> = {
  findMany: jest.fn().mockResolvedValue([problemsArray, problemsArray.length]),
  findOne: jest.fn().mockResolvedValue(oneProblem),
  create: jest.fn().mockResolvedValue(oneProblem),
};
describe('ProblemsPrismaResolver', () => {
  let resolver: ProblemsPrismaResolver;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ProblemsPrismaResolver],
    })
      .useMocker((token) => {
        if (token === ProblemsPrismaService) {
          return mockProblemsService;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
    resolver = moduleRef.get(ProblemsPrismaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should find problems', async () => {
      const problems = await resolver.findAll();

      expect(problems?.items).toEqual(problemsArray);
      expect(problems?.length).toEqual(problemsArray.length);
    });
  });

  describe('findById', () => {
    it('should find one problem', async () => {
      const problem = await resolver.findById({ id: oneProblem.id });

      expect(problem).toEqual(oneProblem);
    });
  });
  describe('create', () => {
    it('should make a new problem', async () => {
      const problem = await resolver.create(oneProblem);

      expect(problem).toEqual(oneProblem);
    });
  });
});
