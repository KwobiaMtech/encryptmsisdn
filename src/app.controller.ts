import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/encrypt/:msisdn')
  async encrypt(@Param('msisdn') msisdn): Promise<string> {
    return await this.appService.encrypt(msisdn);
  }

  @Get('/decrypt/:text')
  async decrypt(@Param('text') text: string): Promise<string> {
    return await this.appService.decrypt(text);
  }
}
