import { Controller, Get, Post, Body, UseGuards, Query, Patch, UsePipes, ValidationPipe, Req, Logger } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../../common/guard/role.guard';
import { GetLastTransactionDto } from '../dto/getLastTransaction.dto';
import { CurrentUser } from '../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { FindTransactionDto } from '../dto/find-transaction.dto';
import { Roles } from '../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../common/constant/role.constant';
import { WithdrawCashDto } from '../dto/create-withdraw-cash.dto';
import { GetBalanceDto } from '../dto/get-balance.dto';
import { UpdateTransactionStatusDto } from '../dto/complete-transaction.dto';
import { GetTransactionLogDto } from '../dto/find-transaction-log.dto';
import { GetTopCustomerPageDto } from '../dto/get-top-customer.dto';
import { GetBankBalanceDto } from '../dto/get-bank-balance.dto';
import { Request } from 'express';
import { SyncStorePrice } from '../dto/sync-store-price.dto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @Get('test')
  getIp(@Req() req: Request) {
    this.logger.log('Request IP:', req.ip);
    this.logger.log('Request URL:', req.originalUrl);
    return {
      ip: req.ip,
      url: req.originalUrl,
    }

  }

  @Post('balance')
  getBalance(@Body() dto: GetBalanceDto) {
    return this.transactionService.getBalance(dto);
  }

  @Post('last-transaction')
  getTransactionByPrivateAccountNumber(@Body() dto: GetLastTransactionDto) {
    return this.transactionService.getLastTransaction(dto);
  }

  @Patch('complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  completeTransaction(@Body() dto: UpdateTransactionStatusDto, @CurrentUser() userPayload: IJwtPayload) {
    return this.transactionService.completedBulkTransaction(dto.transaction_id, userPayload);
  }

  @Patch('cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  cancelTransaction(@Body() dto: UpdateTransactionStatusDto, @CurrentUser() userPayload: IJwtPayload) {
    return this.transactionService.cancleBulkTransaction(dto.transaction_id, userPayload);
  }

  @Patch('detail/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  completeTransactionDetail(@Body() dto: UpdateTransactionStatusDto, @CurrentUser() userPayload: IJwtPayload) {
    return this.transactionService.completedBulkTransactionDetail(dto.transaction_id, userPayload);
  }

  @Patch('detail/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  cancelTransactionDetail(@Body() dto: UpdateTransactionStatusDto, @CurrentUser() userPayload: IJwtPayload) {
    return this.transactionService.cancelBulkTransactionDetail(dto.transaction_id, userPayload);
  }

  @Patch('sync-store-price')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  syncStorePrice(@Body() dto: SyncStorePrice, @CurrentUser() userPayload: IJwtPayload) {
    return this.transactionService.syncStorePrice(dto, userPayload);
  }

  @Post('deposit/thing')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  deopsitThing(@Body() createDto: CreateTransactionDto, @CurrentUser() userPayload: IJwtPayload) {
    return this.transactionService.depositThings(createDto, userPayload);
  }
  
  // @Post('deposit/cash')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth()
  // @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  // depositCash(@Body() createDto: CreateTransactionCashDto) {
  //   return this.transactionService.depositCash(createDto);
  // }
  
  @Post('withdraw/cash')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  withdrawCash(@Body() createDto: WithdrawCashDto) {
    return this.transactionService.withdrawCash(createDto); 
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  findAll(@CurrentUser() userPayload: IJwtPayload, @Query() dto: FindTransactionDto) {
    return this.transactionService.findAll({...dto, bank_id: userPayload.bank_id ?? dto.bank_id});
  }

  @Get('best-customers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  getBestCustomers(@CurrentUser() userPayload: IJwtPayload, @Query() dto: GetTopCustomerPageDto) {
    return this.transactionService.getBestCustomer({...dto, bank_id: userPayload.bank_id ?? dto.bank_id});
  }

  @Get('total-balance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  @UsePipes(new ValidationPipe({ transform: true }))
  getbalance(@CurrentUser() userPayload: IJwtPayload, @Query() dto: GetTransactionLogDto) {
    return this.transactionService.getTotalBalance({...dto, bank_id: userPayload.bank_id ?? dto.bank_id});
  }

  @Get('total-bank-balance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  @UsePipes(new ValidationPipe({ transform: true }))
  getbalanceBank(@CurrentUser() userPayload: IJwtPayload, @Query() dto: GetBankBalanceDto) {
    return this.transactionService.getTotalBalanceBank({...dto, bank_id: userPayload.bank_id ?? dto.bank_id});
  }

  @Get('total-transaction')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  getTotalTransaction(@CurrentUser() userPayload: IJwtPayload) {
    return this.transactionService.getTotalTransaction(userPayload);
  }
}
