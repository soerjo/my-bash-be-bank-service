import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IntegrationService } from '../services/integration.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorator/jwt-payload.decorator';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { RolesGuard } from '../../../../common/guard/role.guard';
import { RoleEnum } from '../../../../common/constant/role.constant';
import { Roles } from '../../../../common/decorator/role.decorator';

@ApiTags('Integration')
@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get("/sync/:bank_sampah_Id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([ RoleEnum.SYSTEM_ADMIN, RoleEnum.ADMIN_BANK ])
  sync(@Param('bank_sampah_Id') bankSampahId: string, @CurrentUser() userPayload: IJwtPayload) {
    return this.integrationService.sync(1, 0, bankSampahId, userPayload);
  }
}
