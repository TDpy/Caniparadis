import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import {Public} from "./decorators/public.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get("error")
  getError(): void {
    throw new Error('Error test');
  }

}
