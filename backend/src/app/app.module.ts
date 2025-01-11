import { Module } from '@nestjs/common';
import { ProductModule } from '../modules/product/product.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { typeOrmConfig } from './config/data.source.options';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV || '.env',
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
