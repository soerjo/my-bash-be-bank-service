import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1743088855288 implements MigrationInterface {
    name = ' Migration1743088855288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "balance_before" numeric(18,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "balance_after" numeric(18,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ALTER COLUMN "amount" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ALTER COLUMN "balance" TYPE numeric(18,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" ALTER COLUMN "balance" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "balance_after"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "balance_before"`);
    }

}
