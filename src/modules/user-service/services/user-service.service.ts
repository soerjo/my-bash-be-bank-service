import { Injectable } from '@nestjs/common';
import { CreateUserServiceDto } from '../dto/create-user-service.dto';
import { UpdateUserServiceDto } from '../dto/update-user-service.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserServiceService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateUserServiceDto, token: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          this.configService.get<string>(
            'USER_SERVICE_URL') + '/cats',
            dto,
            {
              headers: {
                Authorization: token,
                'Content-Type': 'application/json',
              }
            }
          )
      );
      return data?.data;
    } catch (error) {
      console.error('Error creating user service:', error);
      throw new Error('Error creating user service');
    }
  }

  // findAll() {
  //   return `This action returns all userService`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} userService`;
  // }

  // update(id: number, updateUserServiceDto: UpdateUserServiceDto) {
  //   return `This action updates a #${id} userService`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} userService`;
  // }
}
