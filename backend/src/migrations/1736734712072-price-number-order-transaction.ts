import { MigrationInterface, QueryRunner } from "typeorm";

export class PriceNumberOrderTransaction1736734712072 implements MigrationInterface {
    name = 'PriceNumberOrderTransaction1736734712072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD "total" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD "total" numeric(10,2) NOT NULL`);
    }

}
