import { Controller, Post, Body, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { EmitEventDto } from './dto/emit-event.dto';

/**
 * Controller para recibir eventos desde servicios externos (API REST)
 * y emitirlos a través del WebSocket gateway.
 */
@Controller('notifications')
export class NotificationsController {
    private readonly logger = new Logger(NotificationsController.name);

    constructor(private readonly gateway: NotificationsGateway) { }

    /**
     * Endpoint para que servicios externos emitan eventos WebSocket.
     * 
     * @param dto - Datos del evento a emitir
     * @returns Confirmación de éxito
     * 
     * @example
     * POST /notifications/emit
     * {
     *   "userId": 123,
     *   "event": "new_notification",
     *   "payload": { "mensaje": "Ticket asignado", "ticketId": 456 }
     * }
     */
    @Post('emit')
    emitEvent(@Body() dto: EmitEventDto) {
        this.logger.debug(`Emitting event '${dto.event}' to user ${dto.userId}`);

        this.gateway.emitToUser(dto.userId, dto.event, dto.payload);

        return { success: true };
    }
}
