import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/errors/error.handling';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(cookieParser())
  // async function start() {
  // try {
  //   const PORT = process.env.PORT ?? 3030;
  //   const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //   app.useGlobalFilters(new AllExceptionFilter());
  //   app.use(cookieParser());
  //   // app.useGlobalGuards(app.get(JwtGuard), app.get(RolesGuard));
  //   app.useGlobalPipes(
  //     new ValidationPipe({
  //       transform: true,
  //       whitelist: true,
  //       forbidNonWhitelisted: false,
  //       transformOptions: { enableImplicitConversion: true },
  //     }),
  //   );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Elektron Kutubxona API')
    .setDescription('Kitoblar va foydalanuvchilarni boshqarish API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,

      transform: true,
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  
// } catch (error) {
//  console.log(error);
// }}
  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Server is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}
bootstrap();
