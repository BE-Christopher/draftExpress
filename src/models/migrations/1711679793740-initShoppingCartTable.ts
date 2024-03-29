import { MigrationInterface, QueryRunner } from "typeorm";

export class InitShoppingCartTable1711679793740 implements MigrationInterface {
    name = 'InitShoppingCartTable1711679793740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`shopping_cart\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`shoppingCartId\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`shoppingCartId\` int NULL
        `);
        await queryRunner.query(`
            DROP TABLE \`shopping_cart\`
        `);
    }

}
