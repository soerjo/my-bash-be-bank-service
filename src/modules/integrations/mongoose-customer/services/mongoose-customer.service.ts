import { Injectable } from '@nestjs/common';
import { CreateMongooseCustomerDto } from '../dto/create-mongoose-customer.dto';
import { UpdateMongooseCustomerDto } from '../dto/update-mongoose-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../entities/customer.schema';
import { Model } from 'mongoose';

@Injectable()
export class MongooseCustomerService {
  constructor(
    @InjectModel(Customer.name) 
    private customersModel: Model<Customer>,
  ) {}

  async create(createCatDto: any) {
    // const createdCat = new this.customersModel(createCatDto);
    // return createdCat.save();
    return 'This action adds a new mongooseCustomer';
  }

  async findAll(page = 1, limit = 100){
    const skip = (page - 1) * limit;

    const customers = await this.customersModel
      .find()
      .sort({ createdAt: -1 }) // -1 untuk descending, 1 untuk ascending
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.customersModel.countDocuments();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: customers,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} mongooseCustomer`;
  }

  update(id: number, updateMongooseCustomerDto: UpdateMongooseCustomerDto) {
    return `This action updates a #${id} mongooseCustomer`;
  }

  remove(id: number) {
    return `This action removes a #${id} mongooseCustomer`;
  }
}
