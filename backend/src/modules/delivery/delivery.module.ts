import { Module } from '@nestjs/common';
import { DeliveryUsecase } from '@/modules/delivery/domain/api/usecase/delivery.usecase';
import { DeliveryServicePort } from '@/modules/delivery/domain/api/delivery.service.port';
import { DeliveryRepository } from '@/modules/delivery/infrastructure/output/postgres/repository/delivery.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryEntity } from '@/modules/delivery/infrastructure/output/postgres/entity/delivery.entity';
import {
  DeliveryPersistenceAdapter
} from '@/modules/delivery/infrastructure/output/postgres/adapter/delivery.persistence.adapter';
import { DeliveryPersistencePort } from '@/modules/delivery/domain/spi/delivery.persistence.port';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryEntity])],
  controllers: [],
  providers: [
    DeliveryUsecase,
    DeliveryPersistenceAdapter,
    DeliveryRepository,
    {
      provide: DeliveryServicePort,
      useExisting: DeliveryUsecase,
    },
    {
      provide: DeliveryPersistencePort,
      useExisting: DeliveryPersistenceAdapter,
    },
  ],
  exports: [DeliveryServicePort],
})
export class DeliveryModule {}
