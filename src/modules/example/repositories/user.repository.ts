import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { FindUserDto } from '../dto/find-user.dto';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { RoleEnum } from '../../../common/constant/role.constant';

@Injectable()
export class UserRepository  {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  createUser(dto: CreateUserDto) {
    const user = this.usersRepository.create(dto)
    return this.usersRepository.save(user)
  }

  findOneByUsernameOrEmail(usernameOrEmail: string) {
    return this.usersRepository.findOne({
      where: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ],
    })
  }

  async findAll(dto: FindUserDto, userPayload: IJwtPayload) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder.andWhere('user.role_id > :userRoleId', { userRoleId: userPayload.role_id });
    queryBuilder.leftJoinAndSelect('user.role', 'role');
    queryBuilder.select([
      'user.id as id',
      'user.name as name',
      'user.username as username',
      'user.email as email',
      'user.phone as phone',
      'user.bank_id as bank_id',
      'role.name as role',
      `case 
        when user.temp_password IS NULL OR user.temp_password = '' then false 
        else true 
      end as is_reset_password`,
    ])

    if(![RoleEnum.SUPER_ADMIN, RoleEnum.SYSTEM_ADMIN].includes(userPayload.role_id)) {
      queryBuilder.andWhere('user.bank_id = :bank_id', { bank_id: userPayload.bank_id });
    }

    if(dto.username) {
      queryBuilder.andWhere('user.username ilike :username', { username: `%${dto.username}%` });
    }

    if(dto.email) {
      queryBuilder.andWhere('user.email ilike :email', { email: `%${dto.email}%` });
    }

    if(dto.role_id) {
      queryBuilder.andWhere('user.role_id = :role_id', { role_id: dto.role_id });
    }

    queryBuilder.orderBy('user.created_at', 'DESC')
    queryBuilder.skip((dto.page - 1) * dto.take).take(dto.take)
  
    const queryItemCount = queryBuilder.getCount()
    const queryUser = queryBuilder.getRawMany()
    const [itemCount, data] = await Promise.all([queryItemCount, queryUser])

    const meta = {
      page: dto?.page,
      offset: dto?.take,
      itemCount,
      pageCount: Math.ceil(itemCount / dto?.take) ? Math.ceil(itemCount / dto?.take) : 0,
    };

    return { data, meta}
  }

  findOneById(id: number) {
    return this.usersRepository.findOne({ where: { id } })
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } })
  }

  async update(id: number, dto: UpdateUserDto) {
    const existUser = await this.findOneById(id)
    if(!existUser) throw new BadRequestException('User not found');

    const updateUserData = this.usersRepository.create({
        ...existUser,
        ...dto
    })

    console.dir({updateUserData}, {depth: null})

    return this.usersRepository.save(updateUserData)
  }

  remove(id: number) {
    const existUser = this.findOneById(id)
    if(!existUser) throw new BadRequestException('User not found');

    return this.usersRepository.softDelete(id)
  }
}
