import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service.js';
import { User } from '../users/user.entity.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() request: ExpressRequest & { user: User }) {
    return this.authService.login(request.user);
  }
}
