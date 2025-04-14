import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IResponse } from '../../../common/interface/request-response.interface';
import { lastValueFrom } from 'rxjs';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { IResponseCreateWarehouse } from '../dto/response-create-warehouse.dto';
import { IResGetStore } from '../dto/response-get-soter.dto';

@Injectable()
export class WarehouseService {
    constructor(
      private readonly httpService: HttpService,
      private readonly configService: ConfigService,
    ) {}
  
  async getWarehouseByIds(ids: number[], token: string) {
    const response$ = this.httpService.get<IResponse<{ data: Record<string, any>[]; meta: Record<string, any> }>>(
      this.configService.get<string>('WAREHOUSE_SERVICE_URL') + '/store/bulk',
      {
        params: { ids },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data.data;
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

  async getStoreByIds(ids: number[], token: string): Promise<Record<string, any>[]> {
    const response$ = this.httpService.get<IResponse<Record<string, any>[]>>(
      this.configService.get<string>('WAREHOUSE_SERVICE_URL') + '/store/bulk',
      {
        params: { ids },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const response = await lastValueFrom(response$);
    return response.data.data;
  }
}
