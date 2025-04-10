import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
