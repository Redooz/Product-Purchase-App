import { SignupRequest } from '@/auth/application/dto/request/signup.request';
import { LoginResponse } from '@/auth/application/dto/response/login.response';
import { Customer } from '@/customer/domain/model/customer';

export abstract class AuthServicePort {
  abstract signup(signupDto: SignupRequest): Promise<void>;
  abstract generateJwt(user: Customer): LoginResponse;
  abstract validateUser(email: string, password: string): Promise<any>;
}
