import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { UsersPrismaModule } from '../users.prisma/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { JwtModuleConfig } from './jwt.config';

@Global()
@Module({
  imports: [
    UsersPrismaModule,
    JwtModule.registerAsync({
      useClass: JwtModuleConfig,
      imports: [ConfigModule],
    }),
  ],
  providers: [AuthService, JwtGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
