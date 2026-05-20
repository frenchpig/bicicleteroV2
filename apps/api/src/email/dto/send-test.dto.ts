import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class SendTestDto {
  @IsEmail()
  to: string;

  @IsString()
  @MinLength(1)
  templateId: string;
}