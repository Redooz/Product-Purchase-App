import { Test, TestingModule } from '@nestjs/testing';
import { CustomerPersistenceAdapter } from './customer.persistence.adapter';
import { CustomerRepository } from '@/customer/infrastructure/output/postgres/repository/customer.repository';
import { Customer } from '@/customer/domain/model/customer';

describe('CustomerPersistenceAdapter', () => {
  let customerPersistenceAdapter: CustomerPersistenceAdapter;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerPersistenceAdapter,
        {
          provide: CustomerRepository,
          useValue: {
            createCustomer: jest.fn(),
            getCustomerByEmail: jest.fn(),
            getCustomerById: jest.fn(),
          },
        },
      ],
    }).compile();

    customerPersistenceAdapter = module.get<CustomerPersistenceAdapter>(
      CustomerPersistenceAdapter,
    );
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
  });

  it('should create a new customer successfully', async () => {
    // Arrange
    const customer: Customer = {
      email: 'test@example.com',
      password: 'Test User',
    };
    jest
      .spyOn(customerRepository, 'createCustomer')
      .mockResolvedValue(undefined);

    // Act
    await customerPersistenceAdapter.createCustomer(customer);

    // Assert
    expect(customerRepository.createCustomer).toHaveBeenCalledWith(customer);
  });

  it('should return customer by email', async () => {
    // Arrange
    const customer: Customer = {
      email: 'test@example.com',
      password: 'Test User',
    };
    jest
      .spyOn(customerRepository, 'getCustomerByEmail')
      .mockResolvedValue(customer);

    // Act
    const result = await customerPersistenceAdapter.getCustomerByEmail(
      customer.email,
    );

    // Assert
    expect(result).toEqual(customer);
    expect(customerRepository.getCustomerByEmail).toHaveBeenCalledWith(
      customer.email,
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
      .spyOn(customerRepository, 'getCustomerById')
      .mockResolvedValue(customer);

    // Act
    const result = await customerPersistenceAdapter.getCustomerById(
      customer.id,
    );

    // Assert
    expect(result).toEqual(customer);
    expect(customerRepository.getCustomerById).toHaveBeenCalledWith(
      customer.id,
    );
  });

  it('should return null when customer is not found by id', async () => {
    // Arrange
    const customerId = 1;
    jest.spyOn(customerRepository, 'getCustomerById').mockResolvedValue(null);

    // Act
    const result = await customerPersistenceAdapter.getCustomerById(customerId);

    // Assert
    expect(result).toBeNull();
    expect(customerRepository.getCustomerById).toHaveBeenCalledWith(customerId);
  });
});
