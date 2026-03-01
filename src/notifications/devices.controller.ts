import { Controller, Post, Body, Headers } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a device push token (for guests or users)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' },
        platform: { type: 'string', example: 'ios' },
        language: { type: 'string', example: 'EN' },
        userId: { type: 'string', example: 'uuid-optional' },
      },
    },
  })
  async register(
    @Body('pushToken') token: string,
    @Body('platform') platform: string,
    @Body('language') language: string,
    @Body('userId') userId?: string,
  ) {
    if (!token && (arguments[0] as any)?.token) {
        // Fallback if client sends 'token' vs 'pushToken'
        token = (arguments[0] as any).token;
    }
    return this.notificationsService.registerDevice(token, platform, language, userId);
  }
}
