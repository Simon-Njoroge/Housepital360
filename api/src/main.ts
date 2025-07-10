import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './common/guards/at.guard';
import { Reflector } from '@nestjs/core';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  // app.set('trust proxy', true);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', 
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Enable Helmet for security
 app.use(helmet({
    // Disable Content Security Policy to allow inline scripts and styles
    // This is not recommended for production, consider using a proper CSP
    // policy for production environments.
    contentSecurityPolicy: false, 

  }));

  // Cookie parser middleware
  app.use(cookieParser());

  // Logger middleware
  // app.use(LoggerMiddleware);

  app.use(bodyParser.json({ type: 'application/json' }));

  app.useGlobalGuards(new AtGuard(reflector));

  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Housepital360 API')
    .setDescription('API documentation for Housepital360')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
