import { Module } from '@nestjs/common';
import { UserServiceService } from './services/user-service.service';
import { UserServiceController } from './controllers/user-service.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
