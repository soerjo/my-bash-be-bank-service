import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744433776728 implements MigrationInterface {
    name = ' Migration1744433776728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bank"."failed-transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_number" character varying, "fullname" character varying, "balance" character varying, "profile" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b62a56a21e4bdc2a9707cb20c96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "last_transaction_log_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "last_transaction_log_id"`);
        await queryRunner.query(`DROP TABLE "bank"."failed-transaction"`);
    }

}
