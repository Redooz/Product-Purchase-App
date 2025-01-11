import { Injectable } from '@nestjs/common';
import { CustomerServicePort } from '@/customer/domain/api/customer.service.port';
import { CustomerPersistencePort } from '@/customer/domain/spi/customer.persistence.port';
import { Customer } from '@/customer/domain/model/customer';
import { CustomerAlreadyExistsError } from '@/customer/domain/exception/customer.already.exists.error';
import { CustomerNotFoundError } from '@/customer/domain/exception/customer.not.found.error';

@Injectable()
export class CustomerUsecase extends CustomerServicePort {
  constructor(
    private readonly customerPersistencePort: CustomerPersistencePort,
  ) {
    super();
  }

  override async createCustomer(customer: Customer): Promise<void> {
    const existingCustomer =
      await this.customerPersistencePort.getCustomerByEmail(customer.email);

    if (existingCustomer) {
      throw new CustomerAlreadyExistsError(customer.email);
    }

    return await this.customerPersistencePort.createCustomer(customer);
  }

  override async getCustomerByEmail(email: string): Promise<Customer> {
    return await this.customerPersistencePort.getCustomerByEmail(email);
  }

  getCustomerById(id: number): Promise<Customer> {
    const customer = this.customerPersistencePort.getCustomerById(id);

    if (!customer) {
      throw new CustomerNotFoundError(id);
    }

    return customer;
  }
}
