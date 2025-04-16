import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744808936184 implements MigrationInterface {
    name = ' Migration1744808936184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" DROP COLUMN "store_amount"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" DROP COLUMN "store_total_price"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" DROP COLUMN "category_description"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "system_fee_percent" numeric(18,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "system_fee_amount" numeric(18,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "final_amount" numeric(18,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ADD "trx_id" character varying`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ADD "amount" numeric(18,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ADD "final_price" numeric(18,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" ADD "fee_amount" numeric(18,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" ADD "final_amount" numeric(18,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ALTER COLUMN "store_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ALTER COLUMN "store_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" DROP COLUMN "final_amount"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" DROP COLUMN "fee_amount"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" DROP COLUMN "final_price"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" DROP COLUMN "trx_id"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "final_amount"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "system_fee_amount"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "system_fee_percent"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ADD "category_description" character varying`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ADD "store_total_price" numeric(18,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ADD "store_amount" numeric(18,4) NOT NULL DEFAULT '0'`);
    }

}
