/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SeedUsersService } from './seed.users';

@Module({
  imports: [UsersModule],
  providers: [SeedUsersService],
})
export class SeedModule {
  constructor(private seedUsers: SeedUsersService) {}

  async seed() {
    await this.seedUsers.seed();
  }
}
