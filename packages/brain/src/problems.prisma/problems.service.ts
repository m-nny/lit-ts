import { Injectable } from '@nestjs/common';
import { Prisma, Problem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type FindManyParams = {
  skip?: number;
  take?: number;
  cursor?: Prisma.ProblemWhereUniqueInput;
  where?: Prisma.ProblemWhereInput;
  orderBy?: Prisma.ProblemOrderByWithRelationInput;
};

type UpdateParams = {
  where: Prisma.ProblemWhereUniqueInput;
  data: Prisma.ProblemUpdateInput;
};
export type CreateProblemParams = Omit<Prisma.ProblemCreateInput, 'author'> & {
  authorUsername: string;
};

@Injectable()
export class ProblemsPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(whereUnique: Prisma.ProblemWhereUniqueInput): Promise<Problem | null> {
    const item = await this.prisma.problem.findUnique({ where: whereUnique });
    return item;
  }

  async findMany(params: FindManyParams): Promise<[Problem[], number]> {
    const [items, count] = await this.prisma.$transaction([
      this.prisma.problem.findMany(params),
      this.prisma.problem.count(params),
    ]);
    return [items, count];
  }

  async create({ authorUsername, ...data }: CreateProblemParams): Promise<Problem> {
    const item = await this.prisma.problem.create({
      data: { ...data, author: { connect: { username: authorUsername } } },
    });
    return item;
  }

  async update(params: UpdateParams): Promise<Problem> {
    const item = await this.prisma.problem.update(params);
    return item;
  }

  async delete(where: Prisma.ProblemWhereUniqueInput): Promise<Problem> {
    const item = await this.prisma.problem.delete({ where });
    return item;
  }
}
