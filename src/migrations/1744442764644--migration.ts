import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744442764644 implements MigrationInterface {
    name = ' Migration1744442764644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."failed-transaction" ADD "error_message" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."failed-transaction" DROP COLUMN "error_message"`);
    }

}
