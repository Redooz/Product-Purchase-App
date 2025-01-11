import { JwtServicePort } from '@/auth/domain/spi/jwt.service.port';
import { PayloadToken } from '@/auth/domain/models/token.model';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtServiceAdapter extends JwtServicePort {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  override sign(payload: PayloadToken): string {
    return this.jwtService.sign(payload);
  }
}
