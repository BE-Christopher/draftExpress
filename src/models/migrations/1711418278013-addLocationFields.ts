import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationFields1711418278013 implements MigrationInterface {
    name = 'AddLocationFields1711418278013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`locations\`
            ADD \`location_type\` enum ('Home', 'Company', 'Shop') NOT NULL DEFAULT 'Home'
        `);
        await queryRunner.query(`
            ALTER TABLE \`locations\`
            ADD \`is_pick_up_point\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`locations\` DROP COLUMN \`is_pick_up_point\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`locations\` DROP COLUMN \`location_type\`
        `);
    }

}
