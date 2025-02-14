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
import { TransactionHandler } from '@/transaction/application/handler/transaction.handler';
import { TransactionController } from '@/transaction/infrastructure/input/rest/controller/transaction.controller';
import { TransactionStatusEntity } from '@/transaction/infrastructure/output/postgres/entity/transaction.status.entity';
import { TransactionStatusRepository } from '@/transaction/infrastructure/output/postgres/repository/transaction.status.repository';
import { TransactionStatusPersistencePort } from '@/transaction/domain/spi/transaction.status.persistence.port';
import { TransactionStatusPersistenceAdapter } from '@/transaction/infrastructure/output/postgres/adapter/transaction.status.persistence.adapter';
import { DeliveryModule } from '@/modules/delivery/delivery.module';
import { TransactionExceptionHandler } from '@/transaction/infrastructure/input/exceptionhandler/transaction.exception.handler';
import { HttpModule } from '@nestjs/axios';
import { WompiApiClient } from '@/transaction/infrastructure/external/wompi/api/wompi.api.client';
import { WompiAcceptanceServiceAdapter } from '@/transaction/infrastructure/external/wompi/adapter/wompi.acceptance.service.adapter';
import { AcceptanceServicePort } from '@/transaction/domain/spi/acceptance.service.port';
import { WompiPaymentGatewayServiceAdapter } from '@/transaction/infrastructure/external/wompi/adapter/wompi.payment.gateway.service.adapter';
import { PaymentGatewayServicePort } from '@/transaction/domain/spi/payment.gateway.service.port';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([OrderTransactionEntity, TransactionStatusEntity]),
    ProductModule,
    CustomerModule,
    DeliveryModule,
  ],
  controllers: [TransactionController],
  providers: [
    TransactionUsecase,
    TransactionPersistenceAdapter,
    OrderTransactionRepository,
    TransactionStatusRepository,
    TransactionHandler,
    TransactionStatusPersistenceAdapter,
    TransactionExceptionHandler,
    WompiApiClient,
    WompiAcceptanceServiceAdapter,
    WompiPaymentGatewayServiceAdapter,
    {
      provide: TransactionServicePort,
      useExisting: TransactionUsecase,
    },
    {
      provide: TransactionPersistencePort,
      useExisting: TransactionPersistenceAdapter,
    },
    {
      provide: TransactionStatusPersistencePort,
      useExisting: TransactionStatusPersistenceAdapter,
    },
    {
      provide: AcceptanceServicePort,
      useExisting: WompiAcceptanceServiceAdapter,
    },
    {
      provide: PaymentGatewayServicePort,
      useExisting: WompiPaymentGatewayServiceAdapter,
    },
  ],
})
export class TransactionModule {}
