import { MigrationInterface, QueryRunner } from 'typeorm';
import { Status } from '@/transaction/domain/model/enum/status';

export class SeedStatus1736628220192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO transaction_status (status)
       VALUES ('${Status.PENDING}'),
              ('${Status.APPROVED}'),
              ('${Status.REJECTED}')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE
       FROM transaction_status
       WHERE status IN ('${Status.PENDING}', '${Status.APPROVED}', '${Status.REJECTED}')`,
    );
  }
}
