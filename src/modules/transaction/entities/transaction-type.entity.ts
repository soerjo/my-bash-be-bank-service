import { Column, Entity } from "typeorm";
import { MainEntityAbstract } from "../../../common/abstract/main-entity.abstract";

@Entity({ name: 'transaction_type', schema: 'bank' })
export class TransactionTypeEntity extends MainEntityAbstract {
    @Column()
    transaction_type_id: number;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    description: string;
}