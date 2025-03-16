import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1742128250754 implements MigrationInterface {
    name = ' Migration1742128250754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP COLUMN "bank_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD "bank_id" integer NOT NULL`);
    }

}
