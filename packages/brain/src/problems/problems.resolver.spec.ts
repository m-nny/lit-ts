import { Test } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { ProblemEntity } from './models/problems.entity';
import { ProblemsResolver } from './problems.resolver';
import { ProblemsService } from './problems.service';

const moduleMocker = new ModuleMocker(global);

describe('ProblemsResolver', () => {
  let problemsService: jest.Mocked<ProblemsService>;
  let problemsResolver: ProblemsResolver;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ProblemsResolver],
    })
      .useMocker((token) => {
        if (token === ProblemsService) {
          return {
            findAll: jest.fn(
              async (): Promise<[ProblemEntity[], number]> => [
                [
                  plainToClass(ProblemEntity, { id: 1, title: 'P = NP' }),
                  plainToClass(ProblemEntity, { id: 2, title: 'n factorial' }),
                ],
                2,
              ]
            ),
          } as Partial<ProblemsService>;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    problemsService = moduleRef.get(ProblemsService);
    problemsResolver = moduleRef.get(ProblemsResolver);
  });

  it('should be defined', () => {
    expect(problemsResolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of problems', async () => {
      const problems = await problemsResolver.findAll();
      expect(problems?.items).toContainEqual(expect.objectContaining({ id: 1, title: 'P = NP' }));
    });
  });
});
