import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ProductHandler } from './modules/product/application/handler/product.handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const productHandler = app.get(ProductHandler);

  await productHandler.seedProducts();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
