import { MigrationInterface, QueryRunner } from "typeorm";

export class InitPaymentTb1712111541380 implements MigrationInterface {
    name = 'InitPaymentTb1712111541380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`payment\` CHANGE \`isPaid\` \`paidStatus\` enum (
                    'WaitingPaid',
                    'Cancel',
                    'UserPaid',
                    'WaitingAdminPaid',
                    'AdminPaid'
                ) NOT NULL DEFAULT 'WaitingPaid'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`payment\` CHANGE \`paidStatus\` \`isPaid\` enum (
                    'WaitingPaid',
                    'Cancel',
                    'UserPaid',
                    'WaitingAdminPaid',
                    'AdminPaid'
                ) NOT NULL DEFAULT 'WaitingPaid'
        `);
    }

}
