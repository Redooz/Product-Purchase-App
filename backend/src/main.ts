import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ProductHandler } from './modules/product/application/handler/product.handler';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const openApiConfig = new DocumentBuilder()
    .setTitle('Product API')
    .setDescription('Product API description')
    .setVersion('1.0')
    .addTag('product')
    .build();

  const document = SwaggerModule.createDocument(app, openApiConfig);

  SwaggerModule.setup('api', app, document);

  const productHandler = app.get(ProductHandler);
  await productHandler.seedProducts();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
