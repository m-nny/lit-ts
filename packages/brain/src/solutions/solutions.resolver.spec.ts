import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { SolutionEntity } from './models/solutions.entity';
import { SolutionsResolver } from './solutions.resolver';
import { SolutionsService } from './solutions.service';

const moduleMocker = new ModuleMocker(global);

describe('SolutionsResolver', () => {
  let solutionsService: jest.Mocked<SolutionsService>;
  let solutionsResolver: SolutionsResolver;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SolutionsResolver],
    })
      .useMocker((token) => {
        if (token === SolutionsService) {
          return {
            findAll: jest.fn(
              async (): Promise<[SolutionEntity[], number]> => [
                SolutionEntity.fromPojos([
                  { id: 1, body: 'maybe' },
                  { id: 2, body: 'f(n) = f(n - 1) * n' },
                ]),
                2,
              ]
            ),
          } as Partial<SolutionsService>;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    solutionsService = moduleRef.get(SolutionsService);
    solutionsResolver = moduleRef.get(SolutionsResolver);
  });

  it('should be defined', () => {
    expect(solutionsResolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of solutions', async () => {
      const solutions = await solutionsResolver.findAll();
      expect(solutions?.items).toContainEqual(expect.objectContaining({ id: 1, body: 'maybe' }));
    });
  });
});
