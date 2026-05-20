import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: this.config.get('SMTP_PORT'),
      secure: this.config.get('SMTP_SECURE'),
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string) {
    return this.transporter.sendMail({
      from: `"App Admin" <${this.config.get('SMTP_USER')}>`,
      to,
      subject,
      html: body,
    });
  }

  async findAllTemplates() {
    return this.prisma.emailTemplate.findMany({ orderBy: { name: 'asc' } });
  }

  async findTemplateBySlug(slug: string) {
    return this.prisma.emailTemplate.findUnique({ where: { slug } });
  }

  async sendTemplate(to: string, templateSlug: string, replacements: Record<string, string> = {}) {
    const template = await this.findTemplateBySlug(templateSlug);
    if (!template) throw new Error('Template not found');

    let subject = template.subject;
    let body = template.body;

    for (const [key, value] of Object.entries(replacements)) {
      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return this.sendEmail(to, subject, body);
  }
}