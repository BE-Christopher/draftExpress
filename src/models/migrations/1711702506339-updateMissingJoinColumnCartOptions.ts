import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMissingJoinColumnCartOptions1711702506339 implements MigrationInterface {
    name = 'UpdateMissingJoinColumnCartOptions1711702506339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_342497b574edb2309ec8c6b62a\` ON \`user\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`cart_items\`
            ADD \`chooseOptionId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`cart_items\`
            ADD UNIQUE INDEX \`IDX_322d4eab3f410508d3fb7e0211\` (\`chooseOptionId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_322d4eab3f410508d3fb7e0211\` ON \`cart_items\` (\`chooseOptionId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`cart_items\`
            ADD CONSTRAINT \`FK_322d4eab3f410508d3fb7e02119\` FOREIGN KEY (\`chooseOptionId\`) REFERENCES \`cart_item_option\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_322d4eab3f410508d3fb7e02119\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_322d4eab3f410508d3fb7e0211\` ON \`cart_items\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`cart_items\` DROP INDEX \`IDX_322d4eab3f410508d3fb7e0211\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`cart_items\` DROP COLUMN \`chooseOptionId\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_342497b574edb2309ec8c6b62a\` ON \`user\` (\`cartId\`)
        `);
    }

}
