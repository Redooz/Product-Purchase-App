import { MigrationInterface, QueryRunner } from "typeorm";

export class ManyToOneTransactionCustomer1736642785680 implements MigrationInterface {
    name = 'ManyToOneTransactionCustomer1736642785680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_370195597c74709111c2778a442"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "REL_370195597c74709111c2778a44"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_370195597c74709111c2778a442" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_370195597c74709111c2778a442"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "REL_370195597c74709111c2778a44" UNIQUE ("customer_id")`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_370195597c74709111c2778a442" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
