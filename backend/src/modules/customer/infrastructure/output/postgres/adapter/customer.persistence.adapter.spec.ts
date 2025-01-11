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
});
