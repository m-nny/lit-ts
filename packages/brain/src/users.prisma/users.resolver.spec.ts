import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { AppUserRole } from '../auth/models/jwt.app-user';
import { UsersEntity } from './models/users.entity';
import { UsersPrismaResolver } from './users.resolver';
import { UsersPrismaService } from './users.service';

const moduleMocker = new ModuleMocker(global);

describe('UsersPrismaResolver', () => {
  let service: jest.Mocked<UsersPrismaService>;
  let resolver: UsersPrismaResolver;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersPrismaResolver],
    })
      .useMocker((token) => {
        if (token === UsersPrismaService) {
          return {
            findMany: jest.fn(
              async (): Promise<[UsersEntity[], number]> => [
                [
                  {
                    username: 'jane_doe',
                    fullName: 'Jane Doe',
                    hashedPassword: '**hashed_password**',
                    role: AppUserRole.Admin,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ],
                1,
              ]
            ),
            findOne: jest.fn(
              async (username): Promise<UsersEntity | null> => ({
                username: 'jane_doe',
                fullName: 'Jane Doe',
                hashedPassword: '**hashed_password**',
                role: AppUserRole.Admin,
                createdAt: new Date(),
                updatedAt: new Date(),
                ...username,
              })
            ),
            create: jest.fn(
              async (item): Promise<UsersEntity> => ({
                ...item,
                username: 'jane_doe',
                hashedPassword: item.plainPassword + 'hash',
                role: AppUserRole.Admin,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            ),
          } as Partial<UsersPrismaService>;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    service = moduleRef.get(UsersPrismaService);
    resolver = moduleRef.get(UsersPrismaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should find users', async () => {
      const users = await resolver.findAll();

      expect(users?.items).toContainEqual(
        expect.objectContaining({
          username: 'jane_doe',
          fullName: 'Jane Doe',
          hashedPassword: '**hashed_password**',
          role: AppUserRole.Admin,
        })
      );
    });
  });

  describe('findById', () => {
    it('should find one user', async () => {
      const user = await resolver.findById({ username: 'jane_doe' });

      expect(user).toEqual(
        expect.objectContaining({
          username: 'jane_doe',
          fullName: 'Jane Doe',
          hashedPassword: '**hashed_password**',
          role: AppUserRole.Admin,
        })
      );
    });
  });
  describe('create', () => {
    it('should make a new user', async () => {
      const user = await resolver.create({
        username: 'jane_doe',
        fullName: 'Jane Doe',
        hashedPassword: '**hashed_password**',
      });

      expect(user).toEqual(
        expect.objectContaining({
          username: 'jane_doe',
          fullName: 'Jane Doe',
        })
      );
    });
  });
});
