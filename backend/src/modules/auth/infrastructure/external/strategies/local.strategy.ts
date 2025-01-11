import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Customer } from '@/customer/domain/model/customer';
import { AuthServicePort } from '@/auth/domain/api/auth.service.port';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authServicePort: AuthServicePort) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<Customer> {
    const customer = await this.authServicePort.validateUser(email, password);

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return customer;
  }
}
