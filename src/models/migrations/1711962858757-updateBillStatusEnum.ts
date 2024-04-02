import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBillStatusEnum1711962858757 implements MigrationInterface {
    name = 'UpdateBillStatusEnum1711962858757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\` CHANGE \`status\` \`status\` enum (
                    'WaitingApprove',
                    'Approved',
                    'Delivering',
                    'Received',
                    'Cancel',
                    'Reject'
                ) NOT NULL DEFAULT 'WaitingApprove'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\` CHANGE \`status\` \`status\` enum (
                    'WaitingApprove',
                    'Approved',
                    'Delivering',
                    'Received',
                    'Cancel'
                ) NOT NULL DEFAULT 'WaitingApprove'
        `);
    }

}
