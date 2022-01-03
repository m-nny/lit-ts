import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from './models/users.entity';
import { BcryptService } from './users.bcrypt';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, UsersResolver, BcryptService],
  exports: [UsersService, BcryptService],
})
export class UsersModule {}
