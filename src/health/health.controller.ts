import { Controller, Get } from '@nestjs/common';

/**
 * Health check endpoint para AWS App Runner y load balancers.
 */
@Controller()
export class HealthController {
    @Get('health')
    health() {
        return { status: 'ok', service: 'help-desk-ws' };
    }

    @Get()
    root() {
        return { status: 'ok', service: 'help-desk-ws' };
    }
}
