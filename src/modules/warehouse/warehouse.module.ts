import { Module } from '@nestjs/common';
import { WarehouseService } from './services/warehouse.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
