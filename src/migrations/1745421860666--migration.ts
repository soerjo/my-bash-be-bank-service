import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1745421860666 implements MigrationInterface {
    name = ' Migration1745421860666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ADD "store_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" ADD "payload" jsonb DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" DROP COLUMN "payload"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" DROP COLUMN "store_name"`);
    }

}
