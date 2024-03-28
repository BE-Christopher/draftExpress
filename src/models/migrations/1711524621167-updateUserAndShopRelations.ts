import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserAndShopRelations1711524621167 implements MigrationInterface {
    name = 'UpdateUserAndShopRelations1711524621167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`shopId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD UNIQUE INDEX \`IDX_b3eecbc38c05d841d8ebc94ca0\` (\`shopId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_b3eecbc38c05d841d8ebc94ca0\` ON \`user\` (\`shopId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD CONSTRAINT \`FK_b3eecbc38c05d841d8ebc94ca0f\` FOREIGN KEY (\`shopId\`) REFERENCES \`shops\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_b3eecbc38c05d841d8ebc94ca0f\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_b3eecbc38c05d841d8ebc94ca0\` ON \`user\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP INDEX \`IDX_b3eecbc38c05d841d8ebc94ca0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`shopId\`
        `);
    }

}
