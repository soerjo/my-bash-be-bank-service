import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1743827970551 implements MigrationInterface {
    name = ' Migration1743827970551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_status" ADD CONSTRAINT "UQ_1739c61830b989f5265983ac618" UNIQUE ("transaction_status_id")`);
        await queryRunner.query(`ALTER TABLE "transaction_status" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction_type" ADD CONSTRAINT "UQ_fa15cdd9f6ea232ff4f50c0970c" UNIQUE ("transaction_type_id")`);
        await queryRunner.query(`ALTER TABLE "transaction_type" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_type" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction_type" DROP CONSTRAINT "UQ_fa15cdd9f6ea232ff4f50c0970c"`);
        await queryRunner.query(`ALTER TABLE "transaction_status" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction_status" DROP CONSTRAINT "UQ_1739c61830b989f5265983ac618"`);
    }

}
