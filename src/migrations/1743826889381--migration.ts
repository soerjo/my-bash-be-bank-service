import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1743826889381 implements MigrationInterface {
    name = ' Migration1743826889381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "temp_password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "temp_password"`);
    }

}
