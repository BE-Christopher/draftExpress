import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationFromBillToShop1711958016338 implements MigrationInterface {
    name = 'AddRelationFromBillToShop1711958016338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_1c3909d07b27d26ba932d0b409\` ON \`bills\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_fe5e84f255b41fab523c1b92da\` ON \`bills\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD \`shopId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` CHANGE \`status\` \`status\` enum (
                    'WaitingApprove',
                    'Approved',
                    'Delivering',
                    'Received',
                    'Cancel'
                ) NOT NULL DEFAULT 'WaitingApprove'
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD CONSTRAINT \`FK_086e63f54ead492871684fcb84c\` FOREIGN KEY (\`shopId\`) REFERENCES \`shops\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP FOREIGN KEY \`FK_086e63f54ead492871684fcb84c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` CHANGE \`status\` \`status\` enum (
                    'WaitingApprove',
                    'Approved',
                    'Delivering',
                    'Received'
                ) NOT NULL DEFAULT 'WaitingApprove'
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP COLUMN \`shopId\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_fe5e84f255b41fab523c1b92da\` ON \`bills\` (\`pickingPortId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_1c3909d07b27d26ba932d0b409\` ON \`bills\` (\`deliverPortId\`)
        `);
    }

}
