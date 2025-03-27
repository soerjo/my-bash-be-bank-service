import { PartialType } from '@nestjs/swagger';
import { CreateMongooseCustomerDto } from './create-mongoose-customer.dto';

export class UpdateMongooseCustomerDto extends PartialType(CreateMongooseCustomerDto) {}
