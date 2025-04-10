import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { IResponse } from '../../../common/interface/request-response.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { IResponseCreateUser } from '../dto/response-create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getUserByIds(ids: number[], token: string) {
    const response$ = this.httpService.get<IResponse<{ data: any[]; meta: Record<string, any> }>>(
      this.configService.get<string>('USER_SERVICE_URL') + '/user',
      {
        params: { ids: ids },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data.data.data;
  }

  async createUser(dto: CreateUserDto, token: string) {
    const response$ = this.httpService.post<IResponse<IResponseCreateUser>>(
      this.configService.get<string>('USER_SERVICE_URL') + '/user',
      {
        ...dto,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data.data;
  }
}
