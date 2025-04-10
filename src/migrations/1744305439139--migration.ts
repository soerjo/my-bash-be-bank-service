import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744305439139 implements MigrationInterface {
    name = ' Migration1744305439139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."bank" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" ADD CONSTRAINT "UQ_289e9aeebec15832b9b0fe93f5d" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."bank" DROP CONSTRAINT "UQ_289e9aeebec15832b9b0fe93f5d"`);
        await queryRunner.query(`ALTER TABLE "bank"."bank" DROP COLUMN "email"`);
    }

}
