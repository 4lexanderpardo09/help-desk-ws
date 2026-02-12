import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthController } from './health/health.controller';

/**
 * Módulo raíz de la aplicación WebSocket.
 * Importa solo los módulos necesarios para el servicio de notificaciones.
 */
@Module({
    imports: [
        // Configuración de variables de entorno
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        // Módulo de notificaciones WebSocket
        NotificationsModule,
    ],
    controllers: [HealthController],
})
export class AppModule { }
