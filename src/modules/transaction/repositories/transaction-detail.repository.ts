import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TransactionDetailEntity } from "../entities/transaction-detail.entity";

@Injectable()
export class TransactionDetailRepository extends Repository<TransactionDetailEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(TransactionDetailEntity, dataSource.createEntityManager());
    }
}