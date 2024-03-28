import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserAndProductTbStructure1711059554646 implements MigrationInterface {
    name = 'UpdateUserAndProductTbStructure1711059554646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`products\` CHANGE \`inventory\` \`productOptionList\` int NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\`
            ADD \`inventory\` int NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`avatar\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\` DROP COLUMN \`type\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\`
            ADD \`type\` json NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP COLUMN \`productOptionList\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD \`productOptionList\` json NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP COLUMN \`productOptionList\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD \`productOptionList\` int NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\` DROP COLUMN \`type\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\`
            ADD \`type\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`avatar\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\` DROP COLUMN \`inventory\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` CHANGE \`productOptionList\` \`inventory\` int NOT NULL DEFAULT '0'
        `);
    }

}
