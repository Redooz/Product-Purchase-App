import { Injectable } from '@nestjs/common';
import { AuthServicePort } from '@/auth/domain/api/auth.service.port';
import { Customer } from '@/customer/domain/model/customer';
import { Request } from 'express';
import { LoginResponse } from '@/auth/application/dto/response/login.response';
import { SignupRequest } from '@/auth/application/dto/request/signup.request';
import { PayloadToken } from '@/auth/domain/model/token.model';

@Injectable()
export class AuthHandler {
  constructor(private readonly authServicePort: AuthServicePort) {}

  async signup(signupDto: SignupRequest): Promise<void> {
    return await this.authServicePort.signup(signupDto);
  }

  async login(req: Request): Promise<LoginResponse> {
    return this.authServicePort.generateJwt(req.user as Customer);
  }
}
