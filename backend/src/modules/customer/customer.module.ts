import { Module } from '@nestjs/common';
import { CustomerEntity } from '@/customer/infrastructure/output/postgres/entity/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from '@/customer/infrastructure/output/postgres/repository/customer.repository';
import { CustomerUsecase } from '@/customer/domain/api/usecase/customer.usecase';
import { CustomerServicePort } from '@/customer/domain/api/customer.service.port';
import { CustomerPersistencePort } from '@/customer/domain/spi/customer.persistence.port';
import { CustomerPersistenceAdapter } from '@/customer/infrastructure/output/postgres/adapter/customer.persistence.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [
    CustomerRepository,
    CustomerPersistenceAdapter,
    CustomerUsecase,
    {
      provide: CustomerServicePort,
      useExisting: CustomerUsecase,
    },
    {
      provide: CustomerPersistencePort,
      useExisting: CustomerPersistenceAdapter,
    },
  ],
  exports: [CustomerServicePort],
})
export class CustomerModule {}
