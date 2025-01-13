import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneDelivery1736715653804 implements MigrationInterface {
    name = 'AddPhoneDelivery1736715653804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliveries" DROP COLUMN "personName"`);
        await queryRunner.query(`ALTER TABLE "deliveries" DROP COLUMN "postalCode"`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD "person_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD "postal_code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD "phone_number" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliveries" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "deliveries" DROP COLUMN "postal_code"`);
        await queryRunner.query(`ALTER TABLE "deliveries" DROP COLUMN "person_name"`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD "postalCode" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD "personName" character varying NOT NULL`);
    }

}
