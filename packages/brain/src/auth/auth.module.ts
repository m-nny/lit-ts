import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      // TODO(m-nny): move to config
      secret: 'change-in-production',
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
