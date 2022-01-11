import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { AppUserRole } from '../auth/models/jwt.app-user';
import { UsersPrismaResolver } from './users.resolver';
import { UsersPrismaService } from './users.service';

const moduleMocker = new ModuleMocker(global);

const hashedPassword = 'hashed_password';
const plainPassword = 'plain_hassword';

const usersArray = [
  {
    username: 'jane_doe',
    fullName: 'Jane Doe',
    hashedPassword: hashedPassword,
    role: AppUserRole.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
const oneUser = usersArray[0];

const mockUsersService: Partial<UsersPrismaService> = {
  findMany: jest.fn().mockResolvedValue([usersArray, usersArray.length]),
  findOne: jest.fn().mockResolvedValue(oneUser),
  create: jest.fn().mockResolvedValue(oneUser),
};
describe('UsersPrismaResolver', () => {
  let resolver: UsersPrismaResolver;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersPrismaResolver],
    })
      .useMocker((token) => {
        if (token === UsersPrismaService) {
          return mockUsersService;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
    resolver = moduleRef.get(UsersPrismaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should find users', async () => {
      const users = await resolver.findAll();

      expect(users?.items).toEqual(usersArray);
      expect(users?.length).toEqual(usersArray.length);
    });
  });

  describe('findById', () => {
    it('should find one user', async () => {
      const user = await resolver.findById({ username: oneUser.username });

      expect(user).toEqual(oneUser);
    });
  });
  describe('create', () => {
    it('should make a new user', async () => {
      const user = await resolver.create({
        ...oneUser,
        plainPassword,
      });

      expect(user).toEqual(oneUser);
    });
  });
});
