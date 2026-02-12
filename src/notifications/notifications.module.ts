import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller';

/**
 * Módulo de notificaciones en tiempo real.
 * Exporta el gateway para que pueda ser usado por otros módulos.
 */
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET');
                const expiresIn = configService.get<string>('JWT_EXPIRES_IN') || '24h';

                return {
                    secret,
                    signOptions: { expiresIn: expiresIn as any },
                };
            },
        }),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsGateway],
    exports: [NotificationsGateway],
})
export class NotificationsModule { }
