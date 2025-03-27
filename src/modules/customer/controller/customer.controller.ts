import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { RoleEnum } from 'src/common/constant/role.constant';
import { CurrentUser } from 'src/common/decorator/jwt-payload.decorator';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { FindCustomerDto } from '../dto/find-customer.dto';

@ApiTags('Cutomer')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles([
  RoleEnum.SYSTEM_ADMIN,
  RoleEnum.SUPER_ADMIN,
  RoleEnum.USER_SUPER_ADMIN_BANK,
])
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@CurrentUser() userPayload: IJwtPayload, @Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create({
      ...createCustomerDto,
    created_by: userPayload.id,
  });
  }

  @Get()
  findAll(@CurrentUser() userPayload: IJwtPayload, @Query() dto: FindCustomerDto) {
    return this.customerService.findAll(dto, userPayload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
  //   return this.customerService.update(+id, updateCustomerDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
