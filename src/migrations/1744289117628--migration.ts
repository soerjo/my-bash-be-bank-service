import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744289117628 implements MigrationInterface {
    name = ' Migration1744289117628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD "email" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP COLUMN "email"`);
    }

}
