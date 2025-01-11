import { Test, TestingModule } from '@nestjs/testing';
import { AuthHandler } from './auth.handler';
import { AuthServicePort } from '@/auth/domain/api/auth.service.port';
import { SignupRequest } from '@/auth/application/dto/request/signup.request';
import { LoginResponse } from '@/auth/application/dto/response/login.response';
import { Customer } from '@/customer/domain/model/customer';
import { Request } from 'express';

describe('AuthHandler', () => {
  let authHandler: AuthHandler;
  let authServicePort: AuthServicePort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthHandler,
        {
          provide: AuthServicePort,
          useValue: {
            signup: jest.fn(),
            generateJwt: jest.fn(),
          },
        },
      ],
    }).compile();

    authHandler = module.get<AuthHandler>(AuthHandler);
    authServicePort = module.get<AuthServicePort>(AuthServicePort);
  });

  it('should signup a new customer successfully', async () => {
    // Arrange
    const signupDto: SignupRequest = {
      email: 'test@example.com',
      password: 'Test User',
    };
    jest.spyOn(authServicePort, 'signup').mockResolvedValue(Promise.resolve());

    // Act
    await authHandler.signup(signupDto);

    // Assert
    expect(authServicePort.signup).toHaveBeenCalledWith(signupDto);
  });

  it('should login and generate JWT for a customer', async () => {
    // Arrange
    const customer: Customer = {
      email: 'test@example.com',
      password: 'Test User',
    };
    const req = { user: customer } as unknown as Request;
    const loginResponse: LoginResponse = { accessToken: 'jwt-token' };
    jest
      .spyOn(authServicePort, 'generateJwt')
      .mockResolvedValue(loginResponse as never);

    // Act
    const result = await authHandler.login(req);

    // Assert
    expect(result).toEqual(loginResponse);
    expect(authServicePort.generateJwt).toHaveBeenCalledWith(customer);
  });
});
