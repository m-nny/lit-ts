/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { AppUserRole } from '../auth/models/jwt.app-user';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from './users.bcrypt';
import { UsersPrismaService } from './users.service';
import { PartialDeep } from 'type-fest';

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

const mockPrismaService: PartialDeep<PrismaService> = {
  $transaction: jest.fn((fns) => Promise.all(fns) as any),
  user: {
    findMany: jest.fn().mockResolvedValue(usersArray),
    count: jest.fn().mockResolvedValue(usersArray.length),
    findUnique: jest.fn().mockResolvedValue(oneUser),
    create: jest.fn((item) => item.data as any),
    update: jest.fn().mockResolvedValue(oneUser),
    delete: jest.fn().mockResolvedValue(oneUser),
  },
};
const mockBcryptService: PartialDeep<BcryptService> = {
  hashPassword: jest.fn().mockResolvedValue(hashedPassword),
};

describe('UsersPrismaService', () => {
  let service: UsersPrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersPrismaService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return mockPrismaService;
        }
        if (token === BcryptService) {
          return mockBcryptService;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = moduleRef.get(UsersPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    it('should find all users', async () => {
      const users = await service.findMany({});
      expect(users[0]).toEqual(usersArray);
      expect(users[1]).toEqual(usersArray.length);
    });
  });
  describe('findOne', () => {
    it('should find a user', async () => {
      const user = await service.findOne({ username: 'username' });
      expect(user).toEqual(oneUser);
    });
  });
  describe('create', () => {
    it('should hash password and create a new user', async () => {
      const userDto = {
        username: 'jane_doe',
        fullName: 'Jane Doe',
      };
      const user = await service.create({ ...userDto, plainPassword });
      expect(user).toMatchObject(userDto);
      expect(user.hashedPassword).toBe(hashedPassword);
    });
  });
  describe('updateOne', () => {
    it('should update a user', async () => {
      const user = await service.update({
        where: { username: 'username' },
        data: { fullName: 'another name' },
      });
      expect(user).toEqual(oneUser);
    });
  });
  describe('deleteOne', () => {
    it('should delete a user', async () => {
      const user = await service.delete({ username: 'username' });
      expect(user).toEqual(oneUser);
    });
  });
});
