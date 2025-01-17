import { JwtService } from '@nestjs/jwt';
import { JwtServiceAdapter } from './jwt.service.adapter';
import { PayloadToken } from '@/auth/domain/model/token.model';

describe('JwtServiceAdapter', () => {
  let jwtServiceAdapter: JwtServiceAdapter;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({});
    jwtServiceAdapter = new JwtServiceAdapter(jwtService);
  });

  it('should sign a payload and return a token', () => {
    // Arrange
    const payload: PayloadToken = { sub: 1 };
    const token = 'jwt-token';
    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    // Act
    const result = jwtServiceAdapter.sign(payload);

    // Assert
    expect(result).toBe(token);
    expect(jwtService.sign).toHaveBeenCalledWith(payload);
  });
});
