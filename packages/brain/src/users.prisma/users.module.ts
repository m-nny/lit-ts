import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PrismaModule } from '../prisma/prisma.module';
import { BcryptService } from './users.bcrypt';
import { UsersPrismaResolver } from './users.resolver';
import { UsersPrismaService } from './users.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [UsersPrismaService, UsersPrismaResolver, BcryptService],
  controllers: [],
  exports: [UsersPrismaService],
})
export class UsersPrismaModule {}
