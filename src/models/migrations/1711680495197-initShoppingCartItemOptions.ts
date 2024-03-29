import { MigrationInterface, QueryRunner } from "typeorm";

export class InitShoppingCartItemOptions1711680495197 implements MigrationInterface {
    name = 'InitShoppingCartItemOptions1711680495197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`cart_item_option\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`quantity\` int NOT NULL DEFAULT '1',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`cart_item_option\`
        `);
    }

}
