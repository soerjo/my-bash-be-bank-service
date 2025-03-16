import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1742125601154 implements MigrationInterface {
    name = 'InitMigration1742125601154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bank"."transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "customer_id" integer NOT NULL, "bank_id" integer NOT NULL, "customer_account_number" integer NOT NULL, "amount" integer NOT NULL, "transaction_type_id" integer NOT NULL, "message" character varying NOT NULL, "reference_id" integer, "transaction_status_id" integer NOT NULL, "last_transaction_id" integer NOT NULL, "balance_before" integer NOT NULL, "balance_after" integer NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank"."transaction_type" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "transaction_type_id" integer NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank"."transaction_status" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "transaction_status_id" integer NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank"."customer" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "last_transaction_id" character varying NOT NULL, "balance" integer NOT NULL, "user_id" integer NOT NULL, "bank_id" integer NOT NULL, "account_number" character varying NOT NULL, "full_name" character varying NOT NULL, "name" character varying NOT NULL, "identity_number" character varying NOT NULL, "photo_url" character varying NOT NULL, "province" character varying NOT NULL, "regency" character varying NOT NULL, "district" character varying NOT NULL, "village" character varying NOT NULL, "address" text NOT NULL, "postal_code" character varying NOT NULL, "phone" character varying NOT NULL, CONSTRAINT "UQ_b9a88b8d3ad6b22c9a8308b5820" UNIQUE ("last_transaction_id"), CONSTRAINT "UQ_2a42712b807472cef90c07460b7" UNIQUE ("account_number"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank"."bank" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "code" character varying NOT NULL, "province" character varying NOT NULL, "regency" character varying NOT NULL, "district" character varying NOT NULL, "village" character varying NOT NULL, "address" text NOT NULL, "postal_code" character varying NOT NULL, "phone" character varying NOT NULL, CONSTRAINT "UQ_11f196da2e68cef1c7e84b4fe94" UNIQUE ("name"), CONSTRAINT "UQ_efdd3f589f04cd21d79136de1aa" UNIQUE ("code"), CONSTRAINT "PK_7651eaf705126155142947926e8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bank"."bank"`);
        await queryRunner.query(`DROP TABLE "bank"."customer"`);
        await queryRunner.query(`DROP TABLE "bank"."transaction_status"`);
        await queryRunner.query(`DROP TABLE "bank"."transaction_type"`);
        await queryRunner.query(`DROP TABLE "bank"."transaction"`);
    }

}
