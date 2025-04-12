import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744442618442 implements MigrationInterface {
    name = ' Migration1744442618442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."failed-transaction" ADD "error" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."failed-transaction" DROP COLUMN "error"`);
    }

}
