import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744687791643 implements MigrationInterface {
    name = ' Migration1744687791643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."bank" ADD "trx_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."bank" DROP COLUMN "trx_id"`);
    }

}
