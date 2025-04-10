import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744306713433 implements MigrationInterface {
    name = ' Migration1744306713433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "province" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "regency" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "district" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "village" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "postal_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "phone" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "postal_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "village" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "district" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "regency" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "province" SET NOT NULL`);
    }

}
