import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

function showRoutes(server) {
  const router = server._events.request._router;
  router.stack
    .map(layer => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter(item => item !== undefined)
    .forEach((item) => {
      const { route: { method, path } } = item;
      console.log(`${method.toUpperCase().padStart(6, " ")} -> ${path}`);
    });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  const server = await app.listen(3000);

  if (process.env.NODE_ENV_SHOW_ROUTES === "true") {
    showRoutes(server);
  }
}

bootstrap();
