import { EntityManager } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersRepo: jest.Mocked<UsersRepository>;
  let service: UsersService;

  beforeEach(async () => {
    const usersRepoMock = {
      //findAll: jest.fn(),
      //findOne: jest.fn(),
      //persist: jest.fn(),
    };
    const entityManagerMock = {
      //flush: jest.fn(),
      //getRepository: jest.fn(() => usersRepoMock),
      //transactional: jest.fn(async (cb) => {
      //await cb(entityManagerMock);
      //}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EntityManager,
          useValue: entityManagerMock,
        },
        {
          provide: UsersRepository,
          useValue: usersRepoMock,
        },
        UsersService,
      ],
    }).compile();
    usersRepo = module.get(UsersRepository);
    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
