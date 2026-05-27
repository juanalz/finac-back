import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  // Enable CORS so the frontend (served separately) can call the API
  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  });

  // Global validation using class-validator DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true, // Auto-transform types (e.g. string → number)
    }),
  );

  // Swagger / OpenAPI docs at /api
  const config = new DocumentBuilder()
    .setTitle("Finac RESTFul API")
    .setDescription("REST API for the Finac personal finance dashboard")
    .setVersion("1.0")
    .addTag("transactions", "Income and expense records")
    .addTag("categories", "Transaction categories")
    .addTag("summary", "Dashboard summary (balance, income, expenses)")
    .addTag("auth", "Authentication and authorization")
    .addTag("users", "Users and roles")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀  Finac backend running on http://localhost:${port}`);
  console.log(`📄  Swagger docs at  http://localhost:${port}/api`);
}

bootstrap();
