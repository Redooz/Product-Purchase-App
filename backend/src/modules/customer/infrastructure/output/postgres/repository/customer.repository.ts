import { Injectable } from '@nestjs/common';
import { CustomerEntity } from '@/customer/infrastructure/output/postgres/entity/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async createCustomer(customer: CustomerEntity): Promise<void> {
    await this.customerRepository.save(customer);
  }

  async getCustomerByEmail(email: string): Promise<CustomerEntity> {
    return await this.customerRepository.findOne({ where: { email } });
  }
}
