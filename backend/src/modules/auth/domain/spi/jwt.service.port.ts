import { PayloadToken } from '@/auth/domain/model/token.model';

export abstract class JwtServicePort {
  abstract sign(payload: PayloadToken): string;
}
