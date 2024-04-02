import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCardWalletTb1712046843415 implements MigrationInterface {
    name = 'InitCardWalletTb1712046843415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`card_wallets\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`cardNumber\` varchar(255) NOT NULL,
                \`bankId\` int NOT NULL,
                \`csv\` int NULL,
                \`isDisable\` tinyint NOT NULL DEFAULT 0,
                \`authorId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`card_wallets\`
            ADD CONSTRAINT \`FK_ff80c1394ee8062cf7bbc505506\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`card_wallets\` DROP FOREIGN KEY \`FK_ff80c1394ee8062cf7bbc505506\`
        `);
        await queryRunner.query(`
            DROP TABLE \`card_wallets\`
        `);
    }

}
