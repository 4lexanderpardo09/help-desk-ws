/**
 * DTO para emitir eventos WebSocket desde servicios externos.
 * Usado por el API REST para enviar notificaciones en tiempo real.
 */
export class EmitEventDto {
    /** ID del usuario destinatario */
    userId: number;

    /** Nombre del evento (ej: 'new_notification', 'ticket_closed') */
    event: string;

    /** Datos del evento */
    payload: any;
}
