import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  @MinLength(1)
  subject: string;

  @IsString()
  @MinLength(10)
  body: string;
}