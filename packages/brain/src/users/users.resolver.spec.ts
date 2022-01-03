import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { UserEntity } from './models/users.entity';
import { UsersList } from './models/users.list';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

const moduleMocker = new ModuleMocker(global);

describe('UsersResolver', () => {
  let usersService: jest.Mocked<UsersService>;
  let usersResolver: UsersResolver;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersResolver],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return { findAll: jest.fn() } as Partial<UsersService>;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
    usersService = moduleRef.get(UsersService);
    usersResolver = moduleRef.get(UsersResolver);
  });

  it('should be defined', () => {
    expect(usersResolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const items: UserEntity[] = [];
      const resolverResult: UsersList = { items: items, length: items.length };

      jest
        .spyOn(usersService, 'findAll')
        .mockImplementation(async () => [items, items.length]);
      expect(await usersResolver.findAll()).toStrictEqual(resolverResult);
    });
  });
});
