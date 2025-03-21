import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1742565206956 implements MigrationInterface {
    name = ' Migration1742565206956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP CONSTRAINT "UQ_2a42712b807472cef90c07460b7"`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP COLUMN "account_number"`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD "private_account_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD CONSTRAINT "UQ_e7ed36da80d99e3e2e1c7a89da5" UNIQUE ("private_account_number")`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD "public_account_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD CONSTRAINT "UQ_c6ca220838bf97be96ad5981443" UNIQUE ("public_account_number")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP CONSTRAINT "UQ_c6ca220838bf97be96ad5981443"`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP COLUMN "public_account_number"`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP CONSTRAINT "UQ_e7ed36da80d99e3e2e1c7a89da5"`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP COLUMN "private_account_number"`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD "account_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD CONSTRAINT "UQ_2a42712b807472cef90c07460b7" UNIQUE ("account_number")`);
    }

}
