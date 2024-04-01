import { MigrationInterface, QueryRunner } from "typeorm";

export class InitBillTb1711938187335 implements MigrationInterface {
    name = 'InitBillTb1711938187335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`cart_items\`
            ADD \`billId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD \`authorId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD \`deliverPortId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD UNIQUE INDEX \`IDX_1c3909d07b27d26ba932d0b409\` (\`deliverPortId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD \`pickingPortId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD UNIQUE INDEX \`IDX_fe5e84f255b41fab523c1b92da\` (\`pickingPortId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_1c3909d07b27d26ba932d0b409\` ON \`bills\` (\`deliverPortId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_fe5e84f255b41fab523c1b92da\` ON \`bills\` (\`pickingPortId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`cart_items\`
            ADD CONSTRAINT \`FK_94eeef6ce52ffa581d9431b4441\` FOREIGN KEY (\`billId\`) REFERENCES \`bills\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD CONSTRAINT \`FK_6c2f60fc839d36f1a742ebc9dfa\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD CONSTRAINT \`FK_1c3909d07b27d26ba932d0b409b\` FOREIGN KEY (\`deliverPortId\`) REFERENCES \`locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\`
            ADD CONSTRAINT \`FK_fe5e84f255b41fab523c1b92da7\` FOREIGN KEY (\`pickingPortId\`) REFERENCES \`locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP FOREIGN KEY \`FK_fe5e84f255b41fab523c1b92da7\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP FOREIGN KEY \`FK_1c3909d07b27d26ba932d0b409b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP FOREIGN KEY \`FK_6c2f60fc839d36f1a742ebc9dfa\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_94eeef6ce52ffa581d9431b4441\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_fe5e84f255b41fab523c1b92da\` ON \`bills\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_1c3909d07b27d26ba932d0b409\` ON \`bills\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP INDEX \`IDX_fe5e84f255b41fab523c1b92da\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP COLUMN \`pickingPortId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP INDEX \`IDX_1c3909d07b27d26ba932d0b409\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP COLUMN \`deliverPortId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bills\` DROP COLUMN \`authorId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`cart_items\` DROP COLUMN \`billId\`
        `);
    }

}
