import { RoleEnum } from "../../../common/constant/role.constant";

export class CreateUserDto {
    username: string;

    email: string;

    bank_id: number;

    role_id: RoleEnum;
}
