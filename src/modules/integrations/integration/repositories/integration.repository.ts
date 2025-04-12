import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { failedIntegrationEntity } from "../entities/integration.entity";

@Injectable()
export class IntegrationRepositories extends Repository<failedIntegrationEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(failedIntegrationEntity, dataSource.createEntityManager());
    }
}