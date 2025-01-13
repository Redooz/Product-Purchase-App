import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePriceProductPaymentIdOrderTransaction1736730882492
  implements MigrationInterface
{
  name = 'ChangePriceProduct-PaymentIdOrderTransaction1736730882492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_transactions"
        ADD "payment_gateway_transaction_id" character varying`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "products"
        ADD "price" integer NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "products"
        ADD "price" numeric(10, 2) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "order_transactions" DROP COLUMN "payment_gateway_transaction_id"`,
    );
  }
}
