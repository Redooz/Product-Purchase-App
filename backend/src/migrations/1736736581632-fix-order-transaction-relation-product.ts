import { MigrationInterface, QueryRunner } from "typeorm";

export class FixOrderTransactionRelationProduct1736736581632 implements MigrationInterface {
    name = 'FixOrderTransactionRelationProduct1736736581632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_b2d5882366bea888dd629f41b68"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "REL_b2d5882366bea888dd629f41b6"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_b2d5882366bea888dd629f41b68" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_b2d5882366bea888dd629f41b68"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "REL_b2d5882366bea888dd629f41b6" UNIQUE ("product_id")`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_b2d5882366bea888dd629f41b68" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
