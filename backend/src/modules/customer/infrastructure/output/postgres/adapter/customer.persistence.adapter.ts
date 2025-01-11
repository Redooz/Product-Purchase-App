import { CustomerPersistencePort } from '@/customer/domain/spi/customer.persistence.port';
import { Customer } from '@/customer/domain/model/customer';
import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@/customer/infrastructure/output/postgres/repository/customer.repository';

@Injectable()
export class CustomerPersistenceAdapter extends CustomerPersistencePort {
  constructor(private readonly customerRepository: CustomerRepository) {
    super();
  }

  override async createCustomer(customer: Customer): Promise<void> {
    return await this.customerRepository.createCustomer(customer);
  }

  override async getCustomerByEmail(email: string): Promise<Customer> {
    return await this.customerRepository.getCustomerByEmail(email);
  }

  override async getCustomerById(id: number): Promise<Customer | null> {
    const customer = await this.customerRepository.getCustomerById(id);

    if (!customer) {
      return null;
    }

    return customer;
  }
}
