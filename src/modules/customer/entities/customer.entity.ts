import { MainEntityAbstract } from "../../../common/abstract/main-entity.abstract";
import { Column, Entity } from "typeorm";

@Entity({ name: 'customer', schema: 'bank' })
export class CustomerEntity extends MainEntityAbstract {
    @Column({unique: true})
    last_transaction_id: string; // just success transaction id

    @Column()
    balance: number;

    @Column()
    user_id: number;

    @Column({unique: true})
    account_number: string;

    @Column()
    full_name: string;

    @Column()
    name: string;

    @Column()
    identity_number: string;

    @Column()
    photo_url: string;

    @Column()
    province: string;

    @Column()
    regency: string;

    @Column()
    district: string;

    @Column()
    village: string;

    @Column({type: 'text'})
    address: string;

    @Column()
    postal_code: string;

    @Column()
    phone: string;
}
