import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAcceptanceTokenTransaction1736709441637 implements MigrationInterface {
    name = 'AddAcceptanceTokenTransaction1736709441637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD "acceptance_token_end_user_policy" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP COLUMN "acceptance_token_end_user_policy"`);
    }

}
