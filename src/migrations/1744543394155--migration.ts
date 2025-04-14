import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744543394155 implements MigrationInterface {
    name = ' Migration1744543394155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP CONSTRAINT "UQ_b9a88b8d3ad6b22c9a8308b5820"`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP COLUMN "last_transaction_id"`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP COLUMN "balance"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD "balance" numeric(18,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD "last_transaction_id" character varying`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD CONSTRAINT "UQ_b9a88b8d3ad6b22c9a8308b5820" UNIQUE ("last_transaction_id")`);
    }

}
