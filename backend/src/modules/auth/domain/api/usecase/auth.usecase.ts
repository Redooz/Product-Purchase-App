import { AuthServicePort } from '@/auth/domain/api/auth.service.port';
import { LoginResponse } from '@/auth/application/dto/response/login.response';
import { SignupRequest } from '@/auth/application/dto/request/signup.request';
import { JwtServicePort } from '@/auth/domain/spi/jwt.service.port';
import { CustomerServicePort } from '@/customer/domain/api/customer.service.port';
import { Customer } from '@/customer/domain/model/customer';
import { PayloadToken } from '@/auth/domain/model/token.model';
import { compare, hash } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthUsecase extends AuthServicePort {
  constructor(
    private readonly jwtServicePort: JwtServicePort,
    private readonly customerServicePort: CustomerServicePort,
  ) {
    super();
  }

  override async signup(signupDto: SignupRequest): Promise<void> {
    // Replace the password with the encrypted password
    signupDto.password = await hash(signupDto.password, 10);

    const createCustomerProps: Customer = {
      email: signupDto.email,
      password: signupDto.password,
    };

    return await this.customerServicePort.createCustomer(createCustomerProps);
  }

  override generateJwt(user: Customer): LoginResponse {
    const payload: PayloadToken = { sub: user.id };

    return {
      accessToken: this.jwtServicePort.sign(payload),
    };
  }

  override async validateUser(email: string, password: string): Promise<any> {
    const customer = await this.customerServicePort.getCustomerByEmail(email);

    if (!customer) {
      return null;
    }

    const passwordIsValid = await compare(password, customer.password);

    if (!passwordIsValid) {
      return null;
    }

    return customer;
  }
}
