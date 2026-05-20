import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { SendTestDto } from './dto/send-test.dto';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Get('templates')
  findAllTemplates() {
    return this.emailService.findAllTemplates();
  }

  @Post('send')
  sendEmail(@Body() dto: SendEmailDto) {
    return this.emailService.sendEmail(dto.to, dto.subject, dto.body);
  }

  @Post('send-template')
  sendTemplate(@Body() dto: SendTestDto) {
    return this.emailService.sendTemplate(dto.to, dto.templateId);
  }
}