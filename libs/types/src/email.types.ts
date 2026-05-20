export interface EmailTemplate {
  id: number;
  slug: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendEmailDto {
  to: string;
  subject: string;
  body: string;
}

export interface SendTestDto {
  to: string;
  templateId: string;
}