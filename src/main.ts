import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VALIDATION_MESSAGES } from './common/utils/validation-messages';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) => {
        const unknownProperties = errors
          .filter((error) => error.constraints?.whitelistValidation)
          .map((error) =>
            VALIDATION_MESSAGES.propertyNotAllowed(error.property),
          );

        if (unknownProperties.length > 0) {
          return new BadRequestException(unknownProperties);
        }

        return new BadRequestException(
          errors.flatMap((error) => Object.values(error.constraints ?? {})),
        );
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('naPorta API — Gerenciamento de Pedidos')
    .setDescription(
      'API REST desenvolvida com NestJS e TypeScript para gerenciamento de pedidos, ' +
        'com autenticação JWT, operações CRUD, filtros, paginação e exclusão lógica. ' +
        'Utiliza PostgreSQL como banco de dados e Prisma ORM para persistência e acesso aos dados.',
    )
    .setContact('Luiz Felipe Silva', 'https://www.linkedin.com/in/luizfelipe9627', 'felipesilva9627@hotmail.com')
    .setVersion('1.0.0').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    autoTagControllers: false,
  });

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
