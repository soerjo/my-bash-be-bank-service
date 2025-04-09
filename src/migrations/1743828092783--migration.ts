import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1743828092783 implements MigrationInterface {
    name = ' Migration1743828092783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_df972d66ba089168f1ffb0831ca" FOREIGN KEY ("transaction_status_id") REFERENCES "transaction_status"("transaction_status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_98271e4a83052aeca9aa11fd3ca" FOREIGN KEY ("transaction_type_id") REFERENCES "transaction_type"("transaction_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_98271e4a83052aeca9aa11fd3ca"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_df972d66ba089168f1ffb0831ca"`);
    }

}
