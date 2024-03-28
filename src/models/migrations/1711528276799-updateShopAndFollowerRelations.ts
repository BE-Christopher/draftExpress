import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateShopAndFollowerRelations1711528276799 implements MigrationInterface {
    name = 'UpdateShopAndFollowerRelations1711528276799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`shops_followers_user\` (
                \`shopsId\` int NOT NULL,
                \`userId\` int NOT NULL,
                INDEX \`IDX_9309cbd2bf6acf6d0f217f2e9d\` (\`shopsId\`),
                INDEX \`IDX_926d7ab631efd930a5fd244625\` (\`userId\`),
                PRIMARY KEY (\`shopsId\`, \`userId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`shops_followers_user\`
            ADD CONSTRAINT \`FK_9309cbd2bf6acf6d0f217f2e9d1\` FOREIGN KEY (\`shopsId\`) REFERENCES \`shops\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`shops_followers_user\`
            ADD CONSTRAINT \`FK_926d7ab631efd930a5fd2446254\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`shops_followers_user\` DROP FOREIGN KEY \`FK_926d7ab631efd930a5fd2446254\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`shops_followers_user\` DROP FOREIGN KEY \`FK_9309cbd2bf6acf6d0f217f2e9d1\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_926d7ab631efd930a5fd244625\` ON \`shops_followers_user\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_9309cbd2bf6acf6d0f217f2e9d\` ON \`shops_followers_user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`shops_followers_user\`
        `);
    }

}
