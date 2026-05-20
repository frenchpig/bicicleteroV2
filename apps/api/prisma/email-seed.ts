import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    slug: 'welcome',
    name: 'Welcome',
    subject: 'Welcome to {{appName}}!',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome, {{name}}!</h1>
        <p>Thank you for registering at <strong>{{appName}}</strong>. Your account has been created successfully.</p>
        <p>You can now start exploring all the features available to you.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">Best regards,<br/>The {{appName}} Team</p>
      </div>
    `,
  },
  {
    slug: 'reset-password',
    name: 'Reset Password',
    subject: 'Reset your password - {{appName}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Reset Your Password</h1>
        <p>Hello {{name}},</p>
        <p>We received a request to reset the password for your <strong>{{appName}}</strong> account.</p>
        <p>Your verification code is: <strong style="font-size: 18px;">{{code}}</strong></p>
        <p>This code expires in 15 minutes.</p>
        <p>If you did not request this change, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">Best regards,<br/>The {{appName}} Team</p>
      </div>
    `,
  },
  {
    slug: 'admin-notification',
    name: 'Admin Notification',
    subject: '[Admin] {{title}} - {{appName}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Administrative Notification</h1>
        <p>Hello {{name}},</p>
        <p><strong>{{title}}</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p style="margin: 0;">{{message}}</p>
        </div>
        <p>Date: {{date}}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">Automated Notification System - {{appName}}</p>
      </div>
    `,
  },
  {
    slug: 'account-confirmation',
    name: 'Account Confirmation',
    subject: 'Confirm your account - {{appName}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Confirm Your Account</h1>
        <p>Hello {{name}},</p>
        <p>Thank you for registering. Please confirm your account by clicking the link below:</p>
        <p style="margin: 25px 0;">
          <a href="{{confirmationLink}}" style="background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirm Account
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">{{confirmationLink}}</p>
        <p>This link expires in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">Best regards,<br/>The {{appName}} Team</p>
      </div>
    `,
  },
  {
    slug: 'monthly-report',
    name: 'Monthly Report',
    subject: 'Your {{appName}} monthly report - {{month}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Monthly Report</h1>
        <p>Hello {{name}},</p>
        <p>Here is the activity summary for your <strong>{{appName}}</strong> account for <strong>{{month}}</strong>.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Total posts:</strong> {{totalPosts}}</p>
          <p><strong>New posts:</strong> {{newPosts}}</p>
          <p><strong>Last access:</strong> {{lastAccess}}</p>
        </div>
        <p>Keep up the great work! We are here to help.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">Best regards,<br/>The {{appName}} Team</p>
      </div>
    `,
  },
];

async function main() {
  console.log('Seeding email templates...');
  for (const template of templates) {
    await prisma.emailTemplate.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
    console.log(`  OK ${template.name}`);
  }
  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());