import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthServicePort } from '@/auth/domain/api/auth.service.port';
import { Customer } from '@/customer/domain/model/customer';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authServicePort: AuthServicePort;

  beforeEach(() => {
    authServicePort = {
      validateUser: jest.fn(),
    } as unknown as AuthServicePort;
    localStrategy = new LocalStrategy(authServicePort);
  });

  it('should validate and return a customer if credentials are correct', async () => {
    // Arrange
    const customer: Customer = {
      id: 1,
      email: 'test@example.com',
      password: 'password',
    } as Customer;
    jest.spyOn(authServicePort, 'validateUser').mockResolvedValue(customer);

    // Act
    const result = await localStrategy.validate('test@example.com', 'password');

    // Assert
    expect(result).toEqual(customer);
    expect(authServicePort.validateUser).toHaveBeenCalledWith(
      'test@example.com',
      'password',
    );
  });

  it('should throw UnauthorizedException if credentials are incorrect', async () => {
    // Arrange
    jest.spyOn(authServicePort, 'validateUser').mockResolvedValue(null);

    // Act & Assert
    await expect(
      localStrategy.validate('test@example.com', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
    expect(authServicePort.validateUser).toHaveBeenCalledWith(
      'test@example.com',
      'wrongpassword',
    );
  });
});
