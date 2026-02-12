import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

/**
 * Bootstrap del servicio WebSocket.
 * Configuración mínima enfocada solo en WebSocket.
 */
async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);

    // Habilitar CORS para permitir conexiones desde el frontend
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);

    logger.log(`🚀 WebSocket Service running on: http://localhost:${port}`);
    logger.log(`📡 WebSocket namespace: /notifications`);
}

bootstrap();
