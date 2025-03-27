import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IntegrationService } from '../services/integration.service';
import { CreateIntegrationDto } from '../dto/create-integration.dto';
import { UpdateIntegrationDto } from '../dto/update-integration.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Integration')
@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post()
  create(@Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationService.create(createIntegrationDto);
  }

  @Get()
  findAll() {
    return this.integrationService.findAll();
  }

  @Get("/sync")
  sync() {
    return this.integrationService.sync();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.integrationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIntegrationDto: UpdateIntegrationDto) {
    return this.integrationService.update(+id, updateIntegrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.integrationService.remove(+id);
  }
}
