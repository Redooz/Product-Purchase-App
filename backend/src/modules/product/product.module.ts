import { Module } from '@nestjs/common';
import { ProductUsecase } from './domain/api/usecase/product.usecase';
import { ProductServicePort } from './domain/api/product.service.port';
import { ProductRepository } from './infrastructure/output/postgres/repository/product.repository';
import { ProductHandler } from './application/handler/product.handler';
import { ProductPersistenceAdapter } from './infrastructure/output/postgres/adapter/product.persistence.adapter';
import { ProductPersistencePort } from './domain/spi/product.persistence.port';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './infrastructure/output/postgres/entity/product.entity';
import { ProductController } from './infrastructure/input/rest/controller/product.controller';
import { ProductExceptionHandler } from './infrastructure/input/rest/exceptionhandler/product.exception.handler';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [
    ProductUsecase,
    ProductPersistenceAdapter,
    ProductRepository,
    ProductHandler,
    ProductExceptionHandler,
    {
      provide: ProductServicePort,
      useExisting: ProductUsecase,
    },
    {
      provide: ProductPersistencePort,
      useExisting: ProductPersistenceAdapter,
    },
  ],
})
export class ProductModule {}
