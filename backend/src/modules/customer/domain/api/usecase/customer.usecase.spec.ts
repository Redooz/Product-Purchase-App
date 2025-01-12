import { Test, TestingModule } from '@nestjs/testing';
import { CustomerUsecase } from './customer.usecase';
import { CustomerPersistencePort } from '@/customer/domain/spi/customer.persistence.port';
import { Customer } from '@/customer/domain/model/customer';
import { CustomerAlreadyExistsError } from '@/customer/domain/exception/customer.already.exists.error';
import { CustomerNotFoundError } from '@/customer/domain/exception/customer.not.found.error';

describe('CustomerUsecase', () => {
  let customerUsecase: CustomerUsecase;
  let customerPersistencePort: CustomerPersistencePort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerUsecase,
        {
          provide: CustomerPersistencePort,
          useValue: {
            getCustomerByEmail: jest.fn(),
            createCustomer: jest.fn(),
            getCustomerById: jest.fn(),
          },
        },
      ],
    }).compile();

    customerUsecase = module.get<CustomerUsecase>(CustomerUsecase);
    customerPersistencePort = module.get<CustomerPersistencePort>(
      CustomerPersistencePort,
    );
  });

  it('should create a new customer successfully', async () => {
    // Arrange
    const customer: Customer = {
      email: 'test@example.com',
      password: 'Test User',
    };
    jest
      .spyOn(customerPersistencePort, 'getCustomerByEmail')
      .mockResolvedValue(null);
    jest
      .spyOn(customerPersistencePort, 'createCustomer')
      .mockResolvedValue(undefined);

    // Act
    await customerUsecase.createCustomer(customer);

    // Assert
    expect(customerPersistencePort.getCustomerByEmail).toHaveBeenCalledWith(
      customer.email,
    );
    expect(customerPersistencePort.createCustomer).toHaveBeenCalledWith(
      customer,
    );
  });

  it('should throw an error if customer already exists', async () => {
    // Arrange
    const customer: Customer = {
      email: 'test@example.com',
      password: 'Test User',
    };
    jest
      .spyOn(customerPersistencePort, 'getCustomerByEmail')
      .mockResolvedValue(customer);

    // Act & Assert
    await expect(customerUsecase.createCustomer(customer)).rejects.toThrow(
      CustomerAlreadyExistsError,
    );
  });

  it('should return customer by email', async () => {
    // Arrange
    const customer: Customer = {
      email: 'test@example.com',
      password: 'Test User',
    };
    jest
      .spyOn(customerPersistencePort, 'getCustomerByEmail')
      .mockResolvedValue(customer);

    // Act
    const result = await customerUsecase.getCustomerByEmail(customer.email);

    // Assert
    expect(result).toEqual(customer);
    expect(customerPersistencePort.getCustomerByEmail).toHaveBeenCalledWith(
      customer.email,
    );
  });

  it('should return null if customer does not exist', async () => {
    // Arrange
    const email = 'nonexistent@example.com';
    jest
      .spyOn(customerPersistencePort, 'getCustomerByEmail')
      .mockResolvedValue(null);

    // Act
    const result = await customerUsecase.getCustomerByEmail(email);

    // Assert
    expect(result).toBeNull();
    expect(customerPersistencePort.getCustomerByEmail).toHaveBeenCalledWith(
      email,
    );
  });

  it('should return customer by id', async () => {
    // Arrange
    const customer: Customer = {
      id: 1,
      email: 'test@example.com',
      password: 'Test User',
    };
    jest
      .spyOn(customerPersistencePort, 'getCustomerById')
      .mockResolvedValue(customer);

    // Act
    const result = await customerUsecase.getCustomerById(customer.id);

    // Assert
    expect(result).toEqual(customer);
    expect(customerPersistencePort.getCustomerById).toHaveBeenCalledWith(
      customer.id,
    );
  });

  it('should throw an error if customer does not exist by id', async () => {
    // Arrange
    const id = 1;
    jest
      .spyOn(customerPersistencePort, 'getCustomerById')
      .mockResolvedValue(null);

    // Act & Assert
    await expect(customerUsecase.getCustomerById(id)).rejects.toThrow(
      CustomerNotFoundError,
    );
  });
});
