import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/auth-login.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('/login')
  async login(
    @Body() userCredentials: UserCredentialsDto
  ): Promise<{ jwt: string }> {
    const jwt = await this.auth.login(userCredentials);
    if (!jwt) {
      throw new UnauthorizedException(
        'User does not exist or wrong password provided'
      );
    }
    return { jwt };
  }
}
