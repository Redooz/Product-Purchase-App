import { Injectable } from '@nestjs/common';
import { AuthServicePort } from '@/auth/domain/api/auth.service.port';
import { Customer } from '@/customer/domain/model/customer';
import { Request } from 'express';
import { LoginResponse } from '@/auth/application/dtos/response/login.response';
import { SignupRequest } from '@/auth/application/dtos/request/signup.request';

@Injectable()
export class AuthHandler {
  constructor(private readonly authServicePort: AuthServicePort) {}

  async signup(signupDto: SignupRequest): Promise<void> {
    return await this.authServicePort.signup(signupDto);
  }

  async login(req: Request): Promise<LoginResponse> {
    const customer = req.user as Customer;
    return this.authServicePort.generateJwt(customer);
  }
}
