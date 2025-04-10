import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1744306853577 implements MigrationInterface {
    name = ' Migration1744306853577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "owner_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."bank" ALTER COLUMN "owner_id" SET NOT NULL`);
    }

}
