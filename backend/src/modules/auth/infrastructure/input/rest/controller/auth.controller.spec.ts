import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthHandler } from '@/auth/application/handler/auth.handler';
import { AuthExceptionHandler } from '@/auth/infrastructure/input/rest/exceptionhandler/auth.exception.handler';
import { SignupRequest } from '@/auth/application/dto/request/signup.request';
import { LoginResponse } from '@/auth/application/dto/response/login.response';
import { Request } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authHandler: AuthHandler;
  let exceptionHandler: AuthExceptionHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthHandler,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: AuthExceptionHandler,
          useValue: {
            handleSignup: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authHandler = module.get<AuthHandler>(AuthHandler);
    exceptionHandler = module.get<AuthExceptionHandler>(AuthExceptionHandler);
  });

  it('should signup a new customer successfully', async () => {
    // Arrange
    const signupDto: SignupRequest = {
      email: 'test@example.com',
      password: 'Test User',
    };
    jest.spyOn(authHandler, 'signup').mockResolvedValue(undefined);

    // Act
    const result = await authController.signup(signupDto);

    // Assert
    expect(result).toBeUndefined();
    expect(authHandler.signup).toHaveBeenCalledWith(signupDto);
  });

  it('should handle signup error', async () => {
    // Arrange
    const signupDto: SignupRequest = {
      email: 'test@example.com',
      password: 'Test User',
    };
    const error = new Error('Signup failed');
    jest.spyOn(authHandler, 'signup').mockRejectedValue(error);
    jest.spyOn(exceptionHandler, 'handleSignup').mockImplementation(() => {});

    // Act
    await authController.signup(signupDto);

    // Assert
    expect(exceptionHandler.handleSignup).toHaveBeenCalledWith(error);
  });

  it('should login a customer successfully', async () => {
    // Arrange
    const customer = { email: 'test@example.com', password: 'Test User' };
    const req = { user: customer } as unknown as Request;
    const loginResponse: LoginResponse = { accessToken: 'jwt-token' };
    jest.spyOn(authHandler, 'login').mockResolvedValue(loginResponse);

    // Act
    const result = await authController.login(req);

    // Assert
    expect(result).toEqual(loginResponse);
    expect(authHandler.login).toHaveBeenCalledWith(req);
  });

  it('should handle login error', async () => {
    // Arrange
    const customer = { email: 'test@example.com', password: 'Test User' };
    const req = { user: customer } as unknown as Request;
    const error = new Error('Login failed');
    jest.spyOn(authHandler, 'login').mockRejectedValue(error);

    // Act & Assert
    await expect(authController.login(req)).rejects.toThrow('Login failed');
  });
});
