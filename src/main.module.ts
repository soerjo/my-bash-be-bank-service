import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';
import appConfig from './config/app.config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { HttpExceptionFilter } from './common/interceptor/http-exception.interceptor';
import { JwtModule } from '@nestjs/jwt';
// import { ExampleModule } from './modules/example/example.module';
import { BankModule } from './modules/bank/bank.module';
import { CustomerModule } from './modules/customer/customer.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { IntegrationsModule } from './modules/integrations/integration.module';
import { UserServiceModule } from './modules/user-service/user-service.module';
import { UserModule } from './modules/user/user.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get('typeorm'),
    }),
    JwtModule.register({ global: true }),
    // ExampleModule,
    BankModule,
    CustomerModule,
    TransactionModule,
    IntegrationsModule,
    UserServiceModule,
    UserModule,
    WarehouseModule,
    // AuthModule,
    // UserModule,
    // other module...
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
