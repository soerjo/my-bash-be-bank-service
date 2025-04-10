import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744296205054 implements MigrationInterface {
    name = ' Migration1744296205054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ALTER COLUMN "amount" TYPE numeric(18,4)`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ALTER COLUMN "balance_before" TYPE numeric(18,4)`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ALTER COLUMN "balance_after" TYPE numeric(18,4)`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ALTER COLUMN "balance" TYPE numeric(18,4)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" ALTER COLUMN "balance" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ALTER COLUMN "balance_after" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ALTER COLUMN "balance_before" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ALTER COLUMN "amount" TYPE numeric(18,2)`);
    }

}
