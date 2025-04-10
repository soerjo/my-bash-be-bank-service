export interface IResponseCreateUser {
    id: number;
    name: string;
    username: string;
    email: string;
    role_id: number;
    bank_id: number;
    password: string;
    temp_password: string | null;
}