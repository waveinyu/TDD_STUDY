import { BadRequestException, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('error')
    throwError() {
        throw new BadRequestException('에러 테스트 입니다7');
    }
}
