import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRegionDelivery1736711222939 implements MigrationInterface {
    name = 'AddRegionDelivery1736711222939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliveries" ADD "region" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliveries" DROP COLUMN "region"`);
    }

}
