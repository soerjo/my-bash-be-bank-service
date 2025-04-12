import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744424800824 implements MigrationInterface {
    name = ' Migration1744424800824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bank"."transaction-detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_id" uuid NOT NULL, "store_id" integer, "store_price" numeric(18,4) NOT NULL DEFAULT '0', "store_amount" numeric(18,4) NOT NULL DEFAULT '0', "store_total_price" numeric(18,4) NOT NULL DEFAULT '0', "category_id" integer NOT NULL, "category_name" character varying NOT NULL, "category_code" character varying NOT NULL, "category_description" character varying, "unit_id" integer NOT NULL, "unit_name" character varying NOT NULL, "unit_code" character varying NOT NULL, "transaction_type_id" integer NOT NULL, "transaction_status_id" integer NOT NULL, "bank_id" integer, "warehouse_id" integer, CONSTRAINT "PK_f7cecb694676d2a11d1964c7b89" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank"."transaction-log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" integer NOT NULL, "customer_account_number" character varying NOT NULL, "amount" numeric(18,4) NOT NULL DEFAULT '0', "last_balance" numeric(18,4) NOT NULL DEFAULT '0', "present_balance" numeric(18,4) NOT NULL DEFAULT '0', "transaction_type_id" integer NOT NULL, "last_transaction_id" uuid, "last_transaction_log_id" uuid, "transaction_id" uuid, "bank_id" integer, "created_by" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f4de4196f60a9bafc74af0dd213" UNIQUE ("last_transaction_id"), CONSTRAINT "UQ_07e3565879cf3fa99e4b8ebc10d" UNIQUE ("last_transaction_log_id"), CONSTRAINT "UQ_3cfa3b4d69595c688162e46c340" UNIQUE ("transaction_id"), CONSTRAINT "REL_3cfa3b4d69595c688162e46c34" UNIQUE ("transaction_id"), CONSTRAINT "REL_f4de4196f60a9bafc74af0dd21" UNIQUE ("last_transaction_id"), CONSTRAINT "REL_07e3565879cf3fa99e4b8ebc10" UNIQUE ("last_transaction_log_id"), CONSTRAINT "PK_89ff74974ddf3f73fee157b2c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "reference_id"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "balance_before"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "balance_after"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "updated_by" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD CONSTRAINT "FK_dfc462f95320e49136996fdc86b" FOREIGN KEY ("bank_id") REFERENCES "bank"."bank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ADD CONSTRAINT "FK_954d6466f1301d63c6068f65303" FOREIGN KEY ("transaction_status_id") REFERENCES "bank"."transaction_status"("transaction_status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ADD CONSTRAINT "FK_9f5dd5c3deb7b3be7c326f0e4d9" FOREIGN KEY ("transaction_type_id") REFERENCES "bank"."transaction_type"("transaction_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ADD CONSTRAINT "FK_9b72fb3670818e3495b76bba93e" FOREIGN KEY ("bank_id") REFERENCES "bank"."bank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" ADD CONSTRAINT "FK_e75b8fe90f4b344b886b96fb57f" FOREIGN KEY ("transaction_id") REFERENCES "bank"."transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" ADD CONSTRAINT "FK_eadda199f15e0f92bb3c61938e8" FOREIGN KEY ("transaction_type_id") REFERENCES "bank"."transaction_type"("transaction_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" ADD CONSTRAINT "FK_3cfa3b4d69595c688162e46c340" FOREIGN KEY ("transaction_id") REFERENCES "bank"."transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" ADD CONSTRAINT "FK_f4de4196f60a9bafc74af0dd213" FOREIGN KEY ("last_transaction_id") REFERENCES "bank"."transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" ADD CONSTRAINT "FK_07e3565879cf3fa99e4b8ebc10d" FOREIGN KEY ("last_transaction_log_id") REFERENCES "bank"."transaction-log"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" ADD CONSTRAINT "FK_dae8132855377a7092d2fdb1bd5" FOREIGN KEY ("bank_id") REFERENCES "bank"."bank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" ADD CONSTRAINT "FK_51e6558ce3554a369c578fff108" FOREIGN KEY ("customer_id") REFERENCES "bank"."customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" DROP CONSTRAINT "FK_51e6558ce3554a369c578fff108"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" DROP CONSTRAINT "FK_dae8132855377a7092d2fdb1bd5"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" DROP CONSTRAINT "FK_07e3565879cf3fa99e4b8ebc10d"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" DROP CONSTRAINT "FK_f4de4196f60a9bafc74af0dd213"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" DROP CONSTRAINT "FK_3cfa3b4d69595c688162e46c340"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-log" DROP CONSTRAINT "FK_eadda199f15e0f92bb3c61938e8"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" DROP CONSTRAINT "FK_e75b8fe90f4b344b886b96fb57f"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" DROP CONSTRAINT "FK_9b72fb3670818e3495b76bba93e"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" DROP CONSTRAINT "FK_9f5dd5c3deb7b3be7c326f0e4d9"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction-detail" DROP CONSTRAINT "FK_954d6466f1301d63c6068f65303"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP CONSTRAINT "FK_dfc462f95320e49136996fdc86b"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "balance_after" numeric(18,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "balance_before" numeric(18,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "reference_id" integer`);
        await queryRunner.query(`DROP TABLE "bank"."transaction-log"`);
        await queryRunner.query(`DROP TABLE "bank"."transaction-detail"`);
    }

}
