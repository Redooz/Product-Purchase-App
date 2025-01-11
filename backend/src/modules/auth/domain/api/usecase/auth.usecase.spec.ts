import { Test, TestingModule } from '@nestjs/testing';
import { AuthUsecase } from './auth.usecase';
import { JwtServicePort } from '@/auth/domain/spi/jwt.service.port';
import { CustomerServicePort } from '@/customer/domain/api/customer.service.port';
import { SignupRequest } from '@/auth/application/dto/request/signup.request';
import { Customer } from '@/customer/domain/model/customer';
import { LoginResponse } from '@/auth/application/dto/response/login.response';
import { PayloadToken } from '@/auth/domain/model/token.model';
import { hash, compare } from 'bcrypt';
import * as bcrypt from 'bcrypt';

describe('AuthUsecase', () => {
  let authUsecase: AuthUsecase;
  let jwtServicePort: JwtServicePort;
  let customerServicePort: CustomerServicePort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthUsecase,
        {
          provide: JwtServicePort,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: CustomerServicePort,
          useValue: {
            createCustomer: jest.fn(),
            getCustomerByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authUsecase = module.get<AuthUsecase>(AuthUsecase);
    jwtServicePort = module.get<JwtServicePort>(JwtServicePort);
    customerServicePort = module.get<CustomerServicePort>(CustomerServicePort);
  });

  it('should signup a new customer successfully', async () => {
    // Arrange
    const signupDto: SignupRequest = {
      email: 'test@example.com',
      password: 'Test User',
    };
    jest
      .spyOn(customerServicePort, 'createCustomer')
      .mockResolvedValue(undefined);

    // Act
    await authUsecase.signup(signupDto);

    // Assert
    expect(customerServicePort.createCustomer).toHaveBeenCalled();
  });

  it('should generate a JWT for a user', () => {
    // Arrange
    const user: Customer = {
      id: 1,
      email: 'test@example.com',
      password: 'Test User',
    };
    const payload: PayloadToken = { sub: user.id };
    const token = 'jwt-token';
    jest.spyOn(jwtServicePort, 'sign').mockReturnValue(token);

    // Act
    const result: LoginResponse = authUsecase.generateJwt(user);

    // Assert
    expect(result.accessToken).toBe(token);
    expect(jwtServicePort.sign).toHaveBeenCalledWith(payload);
  });

  it('should validate a user with correct credentials', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'Test User';
    const customer: Customer = { email, password: await hash(password, 10) };
    jest
      .spyOn(customerServicePort, 'getCustomerByEmail')
      .mockResolvedValue(customer);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    // Act
    const result = await authUsecase.validateUser(email, password);

    // Assert
    expect(result).toEqual(customer);
    expect(customerServicePort.getCustomerByEmail).toHaveBeenCalledWith(email);
    expect(compare).toHaveBeenCalledWith(password, customer.password);
  });

  it('should return null if user does not exist', async () => {
    // Arrange
    const email = 'nonexistent@example.com';
    const password = 'Test User';
    jest
      .spyOn(customerServicePort, 'getCustomerByEmail')
      .mockResolvedValue(null);

    // Act
    const result = await authUsecase.validateUser(email, password);

    // Assert
    expect(result).toBeNull();
    expect(customerServicePort.getCustomerByEmail).toHaveBeenCalledWith(email);
  });

  it('should return null if password is incorrect', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'Test User';
    const customer: Customer = {
      email,
      password: await hash('wrong password', 10),
    };
    jest
      .spyOn(customerServicePort, 'getCustomerByEmail')
      .mockResolvedValue(customer);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    // Act
    const result = await authUsecase.validateUser(email, password);

    // Assert
    expect(result).toBeNull();
    expect(customerServicePort.getCustomerByEmail).toHaveBeenCalledWith(email);
    expect(compare).toHaveBeenCalledWith(password, customer.password);
  });
});
