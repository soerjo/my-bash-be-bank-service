import { RoleEnum } from "../../../common/constant/role.constant";

export class CreateUserDto {
    username: string;

    email: string;

    role_id: RoleEnum;

    bank_id: number;
    warehouse_id: number;
}
