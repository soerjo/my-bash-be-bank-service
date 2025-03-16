import { RoleEnum } from "../../../common/constant/role.constant";

export class CreateUserDto {
    name: string;
    username: string;
    email: string;
    phone?: string;
    role_id: RoleEnum;
    password: string;
}
