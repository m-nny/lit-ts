import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { AppUser, AppUserRole } from '../auth/models/jwt.app-user';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from './users.bcrypt';

export type UserCredentials = {
  username: string;
  plainPassword: string;
};

type FindManyParams = {
  skip?: number;
  take?: number;
  cursor?: Prisma.UserWhereUniqueInput;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
};

type UpdateParams = {
  where: Prisma.UserWhereUniqueInput;
  data: Prisma.UserUpdateInput;
};
export type CreateUserParams = Omit<Prisma.UserCreateInput, 'hashedPassword'> & {
  plainPassword: string;
};

@Injectable()
export class UsersPrismaService {
  constructor(private readonly prisma: PrismaService, private readonly bcrypt: BcryptService) {}

  async findOne(whereUnique: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const item = await this.prisma.user.findUnique({ where: whereUnique });
    return item;
  }

  async findMany(params: FindManyParams): Promise<[User[], number]> {
    const [items, count] = await this.prisma.$transaction([
      this.prisma.user.findMany(params),
      this.prisma.user.count(params),
    ]);
    return [items, count];
  }

  async create({ plainPassword, ...data }: CreateUserParams): Promise<User> {
    const hashedPassword = await this.bcrypt.hashPassword(plainPassword);
    const item = await this.prisma.user.create({ data: { ...data, hashedPassword } });
    return item;
  }

  async update(params: UpdateParams): Promise<User> {
    const item = await this.prisma.user.update(params);
    return item;
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const item = await this.prisma.user.delete({ where });
    return item;
  }

  async authorize({ username, plainPassword }: UserCredentials): Promise<AppUser | null> {
    const user = await this.findOne({ username });
    if (!user) {
      return null;
    }
    if (!this.bcrypt.checkPassword({ plainPassword, hashedPassword: user.hashedPassword })) {
      return null;
    }
    return {
      username,
      role: user.role as AppUserRole,
    };
  }
}
