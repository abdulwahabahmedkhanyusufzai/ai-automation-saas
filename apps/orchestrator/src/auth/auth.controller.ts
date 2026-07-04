import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: any) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() body: any) {
    return this.authService.googleLogin(body.token);
  }

  @Post('github-login')
  @HttpCode(HttpStatus.OK)
  async githubLogin(@Body() body: any) {
    return this.authService.githubLogin(body.code);
  }
}
