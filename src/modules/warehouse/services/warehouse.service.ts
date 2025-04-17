import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IResponse } from '../../../common/interface/request-response.interface';
import { lastValueFrom } from 'rxjs';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { IResponseCreateWarehouse } from '../dto/response-create-warehouse.dto';
import { DepositItemBulkDto } from '../dto/create-transaction-warehouse.dto';
import { CancelTransactionDto } from '../dto/cancle-transaction.dto';

@Injectable()
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name);

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
    try {
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
    } catch (error) {
      this.logger.error('Failed to create warehouse', error.stack || error.message);
      throw new BadRequestException(error.response.data.message);
    }
  }

  async failedCreateWarehouse(trx_id: string, token: string) {
    this.logger.log('=====================> delete trx_id warehouse trx ');
    try {
      const response$ = this.httpService.delete<IResponse<IResponseCreateWarehouse>>(
        this.configService.get<string>('WAREHOUSE_SERVICE_URL') + '/warehouse/failed/' + trx_id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const response = await lastValueFrom(response$);
      return response.data.data;
    } catch (error) {
      this.logger.error('Failed to cancle create trx warehouse', error.stack || error.message);
      // throw new BadRequestException(error.response.data.message);
    }
  }

  async getStoreByIds(ids: number[], token: string): Promise<Record<string, any>[]> {
    try {
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
    } catch (error) {
      this.logger.error('Failed to create store', error.stack || error.message);
      throw new BadRequestException(error.response.data.message);

    }
  }

  async createTransactionWarehouse(dto: DepositItemBulkDto, token: string) {
    try {
      const response$ = this.httpService.post<IResponse<IResponseCreateWarehouse>>(
        this.configService.get<string>('WAREHOUSE_SERVICE_URL') + '/transaction-store/deposit/bulk',
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
      this.logger.error('Failed to create transction warehouse', error.stack || error.message);
      throw new BadRequestException(error.response.data.message);
    }
  }

  async cancleTransactionWarehouse(dto: CancelTransactionDto, token: string) {
    try {
      const response$ = this.httpService.patch<IResponse<IResponseCreateWarehouse>>(
        this.configService.get<string>('WAREHOUSE_SERVICE_URL') + '/transaction-store/cancel',
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
      this.logger.error('Failed to cancle transaction warehouse', error.stack || error.message);
      throw new BadRequestException(error.response.data.message);
    }
  }

  async completeTransactionWarehouse(transaction_bank_ids: string[], token: string) {
    try {
      const response$ = this.httpService.patch<IResponse<IResponseCreateWarehouse>>(
        this.configService.get<string>('WAREHOUSE_SERVICE_URL') + '/transaction-store/complete',
        {
          transaction_bank_id: transaction_bank_ids,
          trx_id: transaction_bank_ids,
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
      this.logger.error('Failed to cancle transaction warehouse', error.stack || error.message);
      throw new BadRequestException(error.response.data.message);
    }
  }
}
