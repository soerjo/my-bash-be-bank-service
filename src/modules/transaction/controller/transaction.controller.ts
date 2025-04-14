import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
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
import { CreateTransactionCashDto } from '../dto/create-transaction-cash.dto';
import { WithdrawCashDto } from '../dto/create-withdraw-cash.dto';
import { GetBalanceDto } from '../dto/get-balance.dto';
import { UpdateTransactionStatusDto } from '../dto/complete-transaction.dto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('balance')
  getBalance(@Body() dto: GetBalanceDto) {
    return this.transactionService.getBalance(dto);
  }

  @Post('last-transaction')
  getTransactionByPrivateAccountNumber(@Body() dto: GetLastTransactionDto) {
    return this.transactionService.getLastTransaction(dto);
  }

  @Post('complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  completeTransaction(@Body() dto: UpdateTransactionStatusDto, @CurrentUser() userPayload: IJwtPayload) {
    return this.transactionService.completedBulkTransaction(dto.transaction_id, userPayload);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  cancelTransaction(@Body() dto: UpdateTransactionStatusDto, @CurrentUser() userPayload: IJwtPayload) {
    return this.transactionService.cancleBulkTransaction(dto.transaction_id, userPayload);
  }

  @Post('deposit/thing')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  deopsitThing(@Body() createDto: CreateTransactionDto, @CurrentUser() userPayload: IJwtPayload) {
    return this.transactionService.depositThings(createDto, userPayload);
  }

  
  @Post('deposit/cash')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  depositCash(@Body() createDto: CreateTransactionCashDto) {
    return this.transactionService.depositCash(createDto);
  }

  
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
    return this.transactionService.findAll({...dto, bank_id: userPayload.bank_id});
  }


}
