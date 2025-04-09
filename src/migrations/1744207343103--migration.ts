import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744207343103 implements MigrationInterface {
    name = ' Migration1744207343103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP CONSTRAINT "FK_874a0fea77583e5d4e6682ca831"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP CONSTRAINT "REL_874a0fea77583e5d4e6682ca83"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "last_transaction_id"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "last_transaction_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."transaction" DROP COLUMN "last_transaction_id"`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD "last_transaction_id" uuid`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD CONSTRAINT "REL_874a0fea77583e5d4e6682ca83" UNIQUE ("last_transaction_id")`);
        await queryRunner.query(`ALTER TABLE "bank"."transaction" ADD CONSTRAINT "FK_874a0fea77583e5d4e6682ca831" FOREIGN KEY ("last_transaction_id") REFERENCES "bank"."transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
