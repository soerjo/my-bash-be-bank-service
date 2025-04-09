import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1743824779609 implements MigrationInterface {
    name = ' Migration1743824779609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."customer" DROP COLUMN "password"`);
    }

}
