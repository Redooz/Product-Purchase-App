import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionEntityAndRelations1736628187194 implements MigrationInterface {
    name = 'TransactionEntityAndRelations1736628187194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deliveries" ("id" SERIAL NOT NULL, "personName" character varying NOT NULL, "address" character varying NOT NULL, "country" character varying NOT NULL, "city" character varying NOT NULL, "postalCode" character varying NOT NULL, CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_transactions" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "total" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer, "customer_id" integer, "delivery_id" integer, "statusId" integer, CONSTRAINT "REL_b2d5882366bea888dd629f41b6" UNIQUE ("product_id"), CONSTRAINT "REL_370195597c74709111c2778a44" UNIQUE ("customer_id"), CONSTRAINT "REL_99dea54c28ace2f7a918d77adc" UNIQUE ("delivery_id"), CONSTRAINT "PK_a3f432d56165e5acafd5fb17cb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "transaction_status" ("id" SERIAL NOT NULL, "status" "public"."transaction_status_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_b2d5882366bea888dd629f41b68" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_370195597c74709111c2778a442" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_99dea54c28ace2f7a918d77adcc" FOREIGN KEY ("delivery_id") REFERENCES "deliveries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_67e61bdaaf678112529663f8498" FOREIGN KEY ("statusId") REFERENCES "transaction_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_67e61bdaaf678112529663f8498"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_99dea54c28ace2f7a918d77adcc"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_370195597c74709111c2778a442"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_b2d5882366bea888dd629f41b68"`);
        await queryRunner.query(`DROP TABLE "transaction_status"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_transactions"`);
        await queryRunner.query(`DROP TABLE "deliveries"`);
    }

}
