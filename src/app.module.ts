import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';

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
})
export class AppModule { }
