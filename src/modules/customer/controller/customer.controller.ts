import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../../common/guard/role.guard';
import { Roles } from '../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../common/constant/role.constant';
import { CurrentUser } from '../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { FindCustomerDto } from '../dto/find-customer.dto';
import { GetBalanceDto } from '../dto/get-balance.dto';

@ApiTags('Cutomer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  create(@CurrentUser() userPayload: IJwtPayload, @Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create({
      ...createCustomerDto,
    created_by: userPayload.id,
  });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  findAll(@CurrentUser() userPayload: IJwtPayload, @Query() dto: FindCustomerDto) {
    return this.customerService.findAll(dto, userPayload);
  }

  @Get('total-customer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  getTotalCustomer(@CurrentUser() userPayload: IJwtPayload) {
    return this.customerService.getTotalCustomer(userPayload);
  }

  @Get('reset-password/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  resetPassword(@CurrentUser() userPayload: IJwtPayload, @Param('id') id: string) {
    return this.customerService.resetPassword(+id, userPayload);
  }

  @Post('set-new-password/:id')
  setNewPassword(@Body() dto: GetBalanceDto) {
    return this.customerService.setNewPassword(dto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }



  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    await this.customerService.updateCustomer(+id, updateCustomerDto);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth()
  // @Roles([
  //   RoleEnum.SYSTEM_ADMIN,
  //   RoleEnum.ADMIN_BANK,
  // ])
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.customerService.remove(+id);
  // }
}
