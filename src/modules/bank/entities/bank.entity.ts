import { Column, Entity } from "typeorm";
import { MainEntityAbstract } from "../../../common/abstract/main-entity.abstract";

@Entity({ name: 'bank', schema: 'bank' })
export class BankEntity extends MainEntityAbstract {
    @Column({unique: true})
    name: string;

    @Column({unique: true})
    code: string;

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

    // @Column()
    // parent_id: number;
}