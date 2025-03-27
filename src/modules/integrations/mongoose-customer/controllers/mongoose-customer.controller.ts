import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MongooseCustomerService } from '../services/mongoose-customer.service';
import { CreateMongooseCustomerDto } from '../dto/create-mongoose-customer.dto';
import { UpdateMongooseCustomerDto } from '../dto/update-mongoose-customer.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('MongooseCustomer')
@Controller('mongoose-customer')
export class MongooseCustomerController {
  constructor(private readonly mongooseCustomerService: MongooseCustomerService) {}

  @Post()
  create(@Body() createMongooseCustomerDto: CreateMongooseCustomerDto) {
    return this.mongooseCustomerService.create(createMongooseCustomerDto);
  }

  @Get()
  findAll() {
    return this.mongooseCustomerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mongooseCustomerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMongooseCustomerDto: UpdateMongooseCustomerDto) {
    return this.mongooseCustomerService.update(+id, updateMongooseCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mongooseCustomerService.remove(+id);
  }
}
