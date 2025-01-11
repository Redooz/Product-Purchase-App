import { Module } from '@nestjs/common';
import { ProductModule } from '@/product/product.module';
import { CustomerModule } from '@/customer/customer.module';
import { TransactionUsecase } from '@/transaction/domain/api/usecase/transaction.usecase';
import { TransactionServicePort } from '@/transaction/domain/api/transaction.service.port';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTransactionEntity } from '@/transaction/infrastructure/output/postgres/entity/order.transaction.entity';
import { OrderTransactionRepository } from '@/transaction/infrastructure/output/postgres/repository/order.transaction.repository';
import { TransactionPersistenceAdapter } from '@/transaction/infrastructure/output/postgres/adapter/transaction.persistence.adapter';
import { TransactionPersistencePort } from '@/transaction/domain/spi/transaction.persistence.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderTransactionEntity]),
    ProductModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [
    TransactionUsecase,
    TransactionPersistenceAdapter,
    OrderTransactionRepository,
    {
      provide: TransactionServicePort,
      useExisting: TransactionUsecase,
    },
    {
      provide: TransactionPersistencePort,
      useExisting: TransactionPersistenceAdapter,
    },
  ],
})
export class TransactionModule {}
