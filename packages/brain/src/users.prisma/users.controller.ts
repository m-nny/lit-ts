import { Controller, Get, Param } from '@nestjs/common';
import { UsersPrismaService } from './users.service';

@Controller('/users')
export class UsersPrismaController {
  constructor(private readonly usersService: UsersPrismaService) {}

  @Get('/')
  async getAll() {
    const items = await this.usersService.findMany({});
    return items;
  }

  @Get('/:username')
  async getByid(@Param('username') username: string) {
    const items = await this.usersService.findOne({ username });
    return items;
  }
}
