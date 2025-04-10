import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, BadRequestException } from '@nestjs/common';
import { BankService } from '../services/bank.service';
import { CreateBankDto } from '../dto/create-bank.dto';
import { UpdateBankDto } from '../dto/update-bank.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { CurrentUser } from '../../../common/decorator/jwt-payload.decorator';
import { RoleEnum } from '../../../common/constant/role.constant';
import { FindBulkDto } from '../dto/find-bulk.dto';
import { FindBankDto } from '../dto/find-bank.dto';
import { RolesGuard } from '../../../common/guard/role.guard';
import { Roles } from '../../../common/decorator/role.decorator';

@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    RoleEnum.SYSTEM_ADMIN,
  ])
  create(@CurrentUser() userPayload: IJwtPayload, @Body() createBankDto: CreateBankDto) {
    return this.bankService.create(createBankDto, userPayload);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles([
    RoleEnum.SYSTEM_ADMIN,
  ])
  findAll(@CurrentUser() userPayload: IJwtPayload, @Param() dto: FindBankDto) {
    return this.bankService.findAll(dto, userPayload);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles([
    RoleEnum.SYSTEM_ADMIN,
    RoleEnum.ADMIN_BANK,
  ])
  findOne(@CurrentUser() userPayload: IJwtPayload, @Param('id') id: string) {
    return this.bankService.findOneByIds([+id]);
  }

  @Post('get-bulk')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles([
    RoleEnum.SYSTEM_ADMIN,
  ])
  findBulk(@CurrentUser() userPayload: IJwtPayload, @Body() { ids }: FindBulkDto) {
    return this.bankService.findOneByIds(ids.map(Number));
  }

  @Get('validate-name/:name')
  async validateNameExist(@Param('name') name: string) {
    const bank = await this.bankService.findOneByName(name);
    if(bank) throw new BadRequestException('name already exists');
    return { message: 'name is available' };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles([
    RoleEnum.SYSTEM_ADMIN,
    RoleEnum.ADMIN_BANK,
  ])
  update(@CurrentUser() userPayload: IJwtPayload, @Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    if(userPayload.role_id >= RoleEnum.USER_CUSTOMER) throw new ForbiddenException('You are not allowed to update bank account');
    return this.bankService.update(+id, updateBankDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles([
    RoleEnum.SYSTEM_ADMIN,
  ])
  deActived(@CurrentUser() userPayload: IJwtPayload, @Param('id') id: string) {
    if(userPayload.role_id >= RoleEnum.USER_CUSTOMER) throw new ForbiddenException('You are not allowed to delete bank account');
    return this.bankService.remove(+id);
  }
}
