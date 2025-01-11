import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthHandler } from '@/auth/application/handler/auth.handler';
import { SignupRequest } from '@/auth/application/dto/request/signup.request';
import { AuthGuard } from '@nestjs/passport';
import { LoginRequest } from '@/auth/application/dto/request/login.request';
import { Request } from 'express';
import { LoginResponse } from '@/auth/application/dto/response/login.response';
import { AuthExceptionHandler } from '@/auth/infrastructure/input/rest/exceptionhandler/auth.exception.handler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authHandler: AuthHandler,
    private readonly exceptionHandler: AuthExceptionHandler,
  ) {}

  @ApiBody({ type: SignupRequest })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Signup successful',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email, Username or Mobile Number already exists',
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupRequest) {
    try {
      return await this.authHandler.signup(signupDto);
    } catch (error) {
      this.exceptionHandler.handleSignup(error);
    }
  }

  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginRequest })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: LoginResponse,
  })
  @Post('login')
  login(@Req() req: Request) {
    return this.authHandler.login(req);
  }
}
