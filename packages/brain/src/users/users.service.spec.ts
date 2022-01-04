/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { AppUserRole } from '../auth/models/jwt.app-user';
import { CreateUser, UserEntity } from './models/users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

const moduleMocker = new ModuleMocker(global);

describe('UsersService', () => {
  let usersRepo: jest.Mocked<UsersRepository>;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService],
    })
      .useMocker((token) => {
        if (token === UsersRepository) {
          return {
            persist: jest.fn(),
            flush: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          } as Partial<UsersRepository>;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    usersRepo = moduleRef.get(UsersRepository);
    usersService = moduleRef.get(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userDto: CreateUser = {
        username: 'jane_doe',
        fullName: 'Jane Doe',
        roles: [AppUserRole.Admin],
        hashedPassword: '**HASHED_PASSWORD**',
      };
      expect(await usersService.create(userDto)).toMatchObject(userDto);
      expect(usersRepo.persist).toHaveBeenCalled();
      expect(usersRepo.flush).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const users = UserEntity.fromPojos([
        {
          username: 'jane_doe',
          fullName: 'Jane Doe',
          roles: [AppUserRole.Admin],
          hashedPassword: '**HASHED_PASSWORD**',
        },
        {
          username: 'jane-foster',
          fullName: 'Jane Foster',
          roles: [AppUserRole.Student],
          hashedPassword: '**ANOTHER_HASHED_PASSWORD**',
        },
      ]);
      usersRepo.findAll.mockReturnValue(users as any);
      const result = await usersService.findAll();
      expect(result[0]).toContainEqual(
        expect.objectContaining({
          username: 'jane-foster',
          fullName: 'Jane Foster',
          roles: [AppUserRole.Student],
          hashedPassword: '**ANOTHER_HASHED_PASSWORD**',
        })
      );
      expect(usersRepo.findAll).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should find a user', async () => {
      const user = UserEntity.fromPojo({
        username: 'jane_doe',
        fullName: 'Jane Doe',
        roles: [AppUserRole.Admin],
        hashedPassword: '**HASHED_PASSWORD**',
      });
      const userKey = { username: user.username };
      usersRepo.findOne.mockReturnValue(user as any);

      const result = await usersService.findOne(userKey);

      expect(result).toMatchObject(user);
      expect(usersRepo.findOne).toHaveBeenCalled();
    });
  });
});
