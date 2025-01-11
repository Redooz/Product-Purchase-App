import { Module } from '@nestjs/common';
import { ProductModule } from '@/product/product.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { typeOrmConfig } from './config/data.source.options';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { CustomerModule } from '@/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV || '.env',
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ProductModule,
    AuthModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
