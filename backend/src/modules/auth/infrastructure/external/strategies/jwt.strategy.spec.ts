import { JwtStrategy } from './jwt.strategy';
import { ConfigType } from '@nestjs/config';
import configuration from '../../../../../app/config/configuration';
import { ExtractJwt } from 'passport-jwt';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigType<typeof configuration>;

  beforeEach(() => {
    configService = { jwtSecret: 'test-secret' } as ConfigType<
      typeof configuration
    >;
    jwtStrategy = new JwtStrategy(configService);
  });

  it('should be defined', () => {
    // Arrange & Act & Assert
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate payload and return it', async () => {
    // Arrange
    const payload = { sub: 1 };

    // Act
    const result = await jwtStrategy.validate(payload);

    // Assert
    expect(result).toEqual(payload);
  });

  it('should extract JWT from authorization header', () => {
    // Arrange
    const req = {
      headers: {
        authorization: 'Bearer jwt-token',
      },
    };

    // Act
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // Assert
    expect(token).toBe('jwt-token');
  });
});
