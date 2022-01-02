import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserEntity } from './models/users.entity';
import { BcryptService } from './users.bcrypt';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  providers: [UsersService, UsersResolver, BcryptService],
  exports: [UsersService, BcryptService],
})
export class UsersModule {}
