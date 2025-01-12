import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRepository } from './customer.repository';
import { CustomerEntity } from '@/customer/infrastructure/output/postgres/entity/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('CustomerRepository', () => {
  let customerRepository: CustomerRepository;
  let repository: Repository<CustomerEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRepository,
        {
          provide: getRepositoryToken(CustomerEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    customerRepository = module.get<CustomerRepository>(CustomerRepository);
    repository = module.get<Repository<CustomerEntity>>(
      getRepositoryToken(CustomerEntity),
    );
  });

  it('should create a new customer successfully', async () => {
    // Arrange
    const customer: CustomerEntity = {
      email: 'test@example.com',
      password: 'Test User',
    } as CustomerEntity;
    jest.spyOn(repository, 'save').mockResolvedValue(undefined);

    // Act
    await customerRepository.createCustomer(customer);

    // Assert
    expect(repository.save).toHaveBeenCalledWith(customer);
  });

  it('should return customer by email', async () => {
    // Arrange
    const customer: CustomerEntity = {
      email: 'test@example.com',
      password: 'Test User',
    } as CustomerEntity;
    jest.spyOn(repository, 'findOne').mockResolvedValue(customer);

    // Act
    const result = await customerRepository.getCustomerByEmail(customer.email);

    // Assert
    expect(result).toEqual(customer);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: customer.email },
    });
  });

  it('should return customer by id', async () => {
    // Arrange
    const customer: CustomerEntity = {
      id: 1,
      email: 'test@example.com',
      password: 'Test User',
    } as CustomerEntity;

    jest.spyOn(repository, 'findOne').mockResolvedValue(customer);

    // Act
    const result = await customerRepository.getCustomerById(customer.id);

    // Assert
    expect(result).toEqual(customer);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: customer.id },
    });
  });
});
