import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { UserEntity } from './models/users.entity';
import { BcryptService } from './users.bcrypt';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), ConfigModule],
  providers: [UsersService, UsersResolver, BcryptService],
  exports: [MikroOrmModule.forFeature([UserEntity]), UsersService, BcryptService],
})
export class UsersModule {}
