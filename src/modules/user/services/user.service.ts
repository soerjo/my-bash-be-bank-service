import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { IResponse } from '../../../common/interface/request-response.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { IResponseCreateUser } from '../dto/response-create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

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
    try {
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
    } catch (error) {
      this.logger.error('Failed to create user', error.stack || error.message);
      throw new BadRequestException(error.response.data.message);
    }
  }

  async failedCreateUser(trx_id: string, token: string) {
    this.logger.log('=====================> delete trx_id user trx ');
    try {
      const response$ = this.httpService.delete<IResponse<IResponseCreateUser>>(
        this.configService.get<string>('USER_SERVICE_URL') + '/user/failed/' + trx_id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const response = await lastValueFrom(response$);
      return response.data.data;
    } catch (error) {
      this.logger.error('Failed to cancel create trx user', error.stack || error.message);
      // throw new BadRequestException(error.response.data.message);
    }
  }
}
