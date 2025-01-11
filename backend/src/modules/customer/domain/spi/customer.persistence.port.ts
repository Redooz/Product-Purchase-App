import { Customer } from '@/customer/domain/model/customer';

export abstract class CustomerPersistencePort {
  abstract createCustomer(customer: Customer): Promise<void>;
  abstract getCustomerByEmail(email: string): Promise<Customer>;
}
