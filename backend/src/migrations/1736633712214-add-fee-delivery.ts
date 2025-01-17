import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeeDelivery1736633712214 implements MigrationInterface {
    name = 'AddFeeDelivery1736633712214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_status" RENAME COLUMN "status" TO "name"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_status_status_enum" RENAME TO "transaction_status_name_enum"`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD "fee" numeric(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliveries" DROP COLUMN "fee"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_status_name_enum" RENAME TO "transaction_status_status_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction_status" RENAME COLUMN "name" TO "status"`);
    }

}
