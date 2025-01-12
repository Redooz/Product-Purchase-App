import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeFeeDeliveryNullable1736633789017 implements MigrationInterface {
    name = 'MakeFeeDeliveryNullable1736633789017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliveries" ALTER COLUMN "fee" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliveries" ALTER COLUMN "fee" SET NOT NULL`);
    }

}
