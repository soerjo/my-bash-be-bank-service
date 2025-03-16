import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindUserDto } from '../dto/find-user.dto';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../../common/guard/role.guard';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { Roles } from '../../../common/decorator/role.decorator';
import { RoleEnum } from '../../../common/constant/role.constant';
import { CurrentUser } from '../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { ChangePasswordDto } from '../dto/change-password.dto';


@ApiTags('User')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles([    
    RoleEnum.SYSTEM_ADMIN, 
    RoleEnum.SUPER_ADMIN, 
    RoleEnum.USER_ADMIN_BANK, 
    RoleEnum.USER_SUPER_ADMIN_BANK,
  ])
  create(@CurrentUser() userPayload: IJwtPayload, @Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Post('/reset-password')
  @Roles([
    RoleEnum.SYSTEM_ADMIN, 
    RoleEnum.SUPER_ADMIN, 
    RoleEnum.USER_ADMIN_BANK, 
    RoleEnum.USER_SUPER_ADMIN_BANK,
  ])
  resetPassword(@CurrentUser() userPayload: IJwtPayload, @Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(dto, userPayload);
  }

  @Post('/change-password')
  changePassword(@CurrentUser() userPayload: IJwtPayload, @Body() dto: ChangePasswordDto) {
    if(!userPayload.is_temp_password) throw new BadRequestException('You are not allowed to change password');
    return this.userService.changePassword(userPayload, dto);
  }


  @Get()
  @Roles([
    RoleEnum.SYSTEM_ADMIN, 
    RoleEnum.SUPER_ADMIN, 
    RoleEnum.USER_ADMIN_BANK, 
    RoleEnum.USER_SUPER_ADMIN_BANK,
  ])
  findAll(@CurrentUser() userPayload: IJwtPayload, @Query() dto: FindUserDto) {
    console.log('userPayload', userPayload);
    return this.userService.findAll(dto, userPayload);
  }

  @Get(':id')
  @Roles([RoleEnum.SYSTEM_ADMIN, RoleEnum.SUPER_ADMIN])
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
