import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserEntity } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(UserEntity) {}
