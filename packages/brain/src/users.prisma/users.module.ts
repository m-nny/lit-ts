import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersPrismaController } from './users.controller';
import { UsersPrismaResolver } from './users.resolver';
import { UsersPrismaService } from './users.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersPrismaService, UsersPrismaResolver],
  controllers: [UsersPrismaController],
  exports: [],
})
export class UsersPrismaModule {}
