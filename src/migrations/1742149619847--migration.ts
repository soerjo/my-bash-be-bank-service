import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1742149619847 implements MigrationInterface {
    name = ' Migration1742149619847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."bank" RENAME COLUMN "ownerId" TO "owner_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank"."bank" RENAME COLUMN "owner_id" TO "ownerId"`);
    }

}
