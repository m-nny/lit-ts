import { Injectable } from '@nestjs/common';
import { Prisma, Solution } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type FindManyParams = {
  skip?: number;
  take?: number;
  cursor?: Prisma.SolutionWhereUniqueInput;
  where?: Prisma.SolutionWhereInput;
  orderBy?: Prisma.SolutionOrderByWithRelationInput;
};

type UpdateParams = {
  where: Prisma.SolutionWhereUniqueInput;
  data: Prisma.SolutionUpdateInput;
};
export type CreateSolutionParams = Omit<Prisma.SolutionCreateInput, 'author' | 'problem'> & {
  authorUsername: string;
  problemId: number;
};

@Injectable()
export class SolutionsPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(whereUnique: Prisma.SolutionWhereUniqueInput): Promise<Solution | null> {
    const item = await this.prisma.solution.findUnique({ where: whereUnique });
    return item;
  }

  async findMany(params: FindManyParams): Promise<[Solution[], number]> {
    const [items, count] = await this.prisma.$transaction([
      this.prisma.solution.findMany(params),
      this.prisma.solution.count(params),
    ]);
    return [items, count];
  }

  async create({ authorUsername, problemId, ...data }: CreateSolutionParams): Promise<Solution> {
    const item = await this.prisma.solution.create({
      data: { ...data, author: { connect: { username: authorUsername } }, problem: { connect: { id: problemId } } },
    });
    return item;
  }

  async update(params: UpdateParams): Promise<Solution> {
    const item = await this.prisma.solution.update(params);
    return item;
  }

  async delete(where: Prisma.SolutionWhereUniqueInput): Promise<Solution> {
    const item = await this.prisma.solution.delete({ where });
    return item;
  }
}
