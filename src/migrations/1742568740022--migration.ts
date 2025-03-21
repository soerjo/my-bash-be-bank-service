import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1742568740022 implements MigrationInterface {
    name = ' Migration1742568740022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" ALTER COLUMN "last_transaction_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ALTER COLUMN "balance" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" ALTER COLUMN "balance" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bank"."customer" ALTER COLUMN "last_transaction_id" SET NOT NULL`);
    }

}
