import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1743087932277 implements MigrationInterface {
    name = ' Migration1743087932277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "customer_id" integer NOT NULL, "bank_id" integer, "customer_account_number" character varying NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "transaction_type_id" integer NOT NULL, "message" character varying NOT NULL, "reference_id" integer, "transaction_status_id" integer NOT NULL, "last_transaction_id" uuid, CONSTRAINT "REL_874a0fea77583e5d4e6682ca83" UNIQUE ("last_transaction_id"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_type" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "transaction_type_id" integer NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_status" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "transaction_status_id" integer NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "last_transaction_id" character varying, "balance" numeric NOT NULL DEFAULT '0', "user_id" integer, "bank_id" integer, "private_account_number" character varying NOT NULL, "public_account_number" character varying NOT NULL, "full_name" character varying, "name" character varying, "identity_number" character varying, "photo_url" character varying, "province" character varying, "regency" character varying, "district" character varying, "village" character varying, "address" text, "postal_code" character varying, "phone" character varying, CONSTRAINT "UQ_b9a88b8d3ad6b22c9a8308b5820" UNIQUE ("last_transaction_id"), CONSTRAINT "UQ_e7ed36da80d99e3e2e1c7a89da5" UNIQUE ("private_account_number"), CONSTRAINT "UQ_c6ca220838bf97be96ad5981443" UNIQUE ("public_account_number"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "code" character varying NOT NULL, "province" character varying NOT NULL, "regency" character varying NOT NULL, "district" character varying NOT NULL, "village" character varying NOT NULL, "address" text NOT NULL, "postal_code" character varying NOT NULL, "phone" character varying NOT NULL, "owner_id" integer NOT NULL, CONSTRAINT "UQ_11f196da2e68cef1c7e84b4fe94" UNIQUE ("name"), CONSTRAINT "UQ_efdd3f589f04cd21d79136de1aa" UNIQUE ("code"), CONSTRAINT "PK_7651eaf705126155142947926e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_874a0fea77583e5d4e6682ca831" FOREIGN KEY ("last_transaction_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_874a0fea77583e5d4e6682ca831"`);
        await queryRunner.query(`DROP TABLE "bank"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "transaction_status"`);
        await queryRunner.query(`DROP TABLE "transaction_type"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
    }

}
