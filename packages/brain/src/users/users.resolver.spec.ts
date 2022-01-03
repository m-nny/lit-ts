import { Test } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { AppUserRole } from '../auth/models/jwt.app-user';
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
          return {
            findAll: jest.fn(
              async (): Promise<[UserEntity[], number]> => [
                [
                  new UserEntity({
                    username: 'jane_doe',
                    fullName: 'Jane Doe',
                    roles: [AppUserRole.admin],
                    hashedPassword: '**SOME_HASHED_PASSWORD**',
                  }),
                  new UserEntity({
                    username: 'jane_foster',
                    fullName: 'Jane Foster',
                    roles: [AppUserRole.student],
                    hashedPassword: '**ANOTHER_HASHED_PASSWORD**',
                  }),
                ],
                0,
              ]
            ),
          } as Partial<UsersService>;
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
      //const resolverResult: UsersList = { items: items, length: items.length };

      const users = await usersResolver.findAll();
      expect(users?.items).toContainEqual(
        expect.objectContaining({
          username: 'jane_doe',
          fullName: 'Jane Doe',
          roles: [AppUserRole.admin],
          hashedPassword: '**SOME_HASHED_PASSWORD**',
        })
      );
    });
  });
});
