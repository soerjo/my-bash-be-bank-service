import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IResponse } from '../../../common/interface/request-response.interface';
import { lastValueFrom } from 'rxjs';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { IResponseCreateWarehouse } from '../dto/response-create-warehouse.dto';

@Injectable()
export class WarehouseService {
    constructor(
      private readonly httpService: HttpService,
      private readonly configService: ConfigService,
    ) {}
  
  async getWarehouseByIds(ids: number[], token: string) {
    const response$ = this.httpService.get<IResponse<{ data: any[]; meta: Record<string, any> }>>(
      this.configService.get<string>('WAREHOUSE_SERVICE_URL') + '/warehouse',
      {
        params: { ids },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data.data.data;
  }

  async createWarehouse(dto: CreateWarehouseDto, token: string) {
    const response$ = this.httpService.post<IResponse<IResponseCreateWarehouse>>(
      this.configService.get<string>('WAREHOUSE_SERVICE_URL') + '/warehouse',
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
