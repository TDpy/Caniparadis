import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
// eslint-disable-next-line unicorn/import-style
import { join } from 'node:path';

import { EmailService } from './email.service';

@Module({})
export class EmailModule {
  static register(): DynamicModule {
    const isTest = process.env.NODE_ENV === 'test';

    return {
      module: EmailModule,
      imports: [
        ConfigModule.forRoot(),
        ...(isTest
          ? []
          : [
            MailerModule.forRootAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: async () => {
                const { HandlebarsAdapter } = await import(
                  '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
                  );
                return {
                  transport: {
                    host: process.env.MAIL_HOST,
                    port: +process.env.MAIL_PORT,
                    auth: {
                      user: process.env.MAIL_USER,
                      pass: process.env.MAIL_PASSWORD,
                    },
                  },
                  defaults: {
                    from: `"No Reply" <${process.env.MAIL_FROM}>`,
                  },
                  template: {
                    dir: join(process.cwd(), 'src', 'email', 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                      strict: true,
                    },
                  },
                };
              },
            }),
          ]),
      ],
      providers: [EmailService],
      exports: [EmailService],
    };
  }
}
