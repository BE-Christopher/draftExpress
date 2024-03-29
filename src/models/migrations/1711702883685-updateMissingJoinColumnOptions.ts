import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMissingJoinColumnOptions1711702883685 implements MigrationInterface {
    name = 'UpdateMissingJoinColumnOptions1711702883685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_322d4eab3f410508d3fb7e0211\` ON \`cart_items\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\`
            ADD \`cartItemOptionId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\`
            ADD UNIQUE INDEX \`IDX_f8865832aa808eedf825ddd140\` (\`cartItemOptionId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_f8865832aa808eedf825ddd140\` ON \`product_Options\` (\`cartItemOptionId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\`
            ADD CONSTRAINT \`FK_f8865832aa808eedf825ddd1405\` FOREIGN KEY (\`cartItemOptionId\`) REFERENCES \`cart_item_option\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`product_Options\` DROP FOREIGN KEY \`FK_f8865832aa808eedf825ddd1405\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_f8865832aa808eedf825ddd140\` ON \`product_Options\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\` DROP INDEX \`IDX_f8865832aa808eedf825ddd140\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\` DROP COLUMN \`cartItemOptionId\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_322d4eab3f410508d3fb7e0211\` ON \`cart_items\` (\`chooseOptionId\`)
        `);
    }

}
