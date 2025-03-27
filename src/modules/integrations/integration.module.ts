import { Module } from '@nestjs/common';
import { MongooseCustomerModule } from './mongoose-customer/mongoose-customer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    MongooseCustomerModule,
    IntegrationModule,
  ],
})
export class IntegrationsModule {}
