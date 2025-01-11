import { PayloadToken } from '@/auth/domain/models/token.model';

export abstract class JwtServicePort {
  abstract sign(payload: PayloadToken): string;
}
