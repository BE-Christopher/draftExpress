import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIndustryAndShopRetlations1711526871566 implements MigrationInterface {
    name = 'UpdateIndustryAndShopRetlations1711526871566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_b3eecbc38c05d841d8ebc94ca0\` ON \`user\`
        `);
        await queryRunner.query(`
            CREATE TABLE \`shops_industries_industries\` (
                \`shopsId\` int NOT NULL,
                \`industriesId\` int NOT NULL,
                INDEX \`IDX_1f1f062cb5ea5be7615a62ec83\` (\`shopsId\`),
                INDEX \`IDX_b7d638623a0362305f1d4990ed\` (\`industriesId\`),
                PRIMARY KEY (\`shopsId\`, \`industriesId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`shops_industries_industries\`
            ADD CONSTRAINT \`FK_1f1f062cb5ea5be7615a62ec83e\` FOREIGN KEY (\`shopsId\`) REFERENCES \`shops\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`shops_industries_industries\`
            ADD CONSTRAINT \`FK_b7d638623a0362305f1d4990ed0\` FOREIGN KEY (\`industriesId\`) REFERENCES \`industries\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`shops_industries_industries\` DROP FOREIGN KEY \`FK_b7d638623a0362305f1d4990ed0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`shops_industries_industries\` DROP FOREIGN KEY \`FK_1f1f062cb5ea5be7615a62ec83e\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_b7d638623a0362305f1d4990ed\` ON \`shops_industries_industries\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_1f1f062cb5ea5be7615a62ec83\` ON \`shops_industries_industries\`
        `);
        await queryRunner.query(`
            DROP TABLE \`shops_industries_industries\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_b3eecbc38c05d841d8ebc94ca0\` ON \`user\` (\`shopId\`)
        `);
    }

}
