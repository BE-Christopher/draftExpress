import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTbsForProductService1710898214795 implements MigrationInterface {
    name = 'CreateTbsForProductService1710898214795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`product_asserts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`url\` varchar(255) NOT NULL,
                \`productId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`feedback_asserts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`url\` varchar(255) NOT NULL,
                \`feedbackId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`feedbacks\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`date_posted\` datetime NOT NULL,
                \`rating\` int NOT NULL DEFAULT '50',
                \`content\` varchar(255) NULL,
                \`authorId\` int NULL,
                \`productId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`product_Options\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`type\` varchar(255) NOT NULL,
                \`isAvailable\` tinyint NOT NULL DEFAULT 1,
                \`productId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`products\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`unit\` enum ('VND', 'USD', 'EUR') NOT NULL DEFAULT 'VND',
                \`price\` int NOT NULL,
                \`description\` varchar(255) NOT NULL,
                \`sold\` int NOT NULL DEFAULT '0',
                \`inventory\` int NOT NULL DEFAULT '0',
                \`shopId\` int NULL,
                \`industryId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`industries\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`shop_asserts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`url\` varchar(255) NOT NULL,
                \`shopId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`shops\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`description\` varchar(255) NOT NULL,
                \`status\` enum ('Inactive', 'Active', 'Pause', 'Close') NOT NULL DEFAULT 'Inactive',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_asserts\`
            ADD CONSTRAINT \`FK_730b2706250e59bb6fbe88a2b1c\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`feedback_asserts\`
            ADD CONSTRAINT \`FK_234a6f8394e7c1a29fe85cfd4dd\` FOREIGN KEY (\`feedbackId\`) REFERENCES \`feedbacks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`feedbacks\`
            ADD CONSTRAINT \`FK_0e41cb96ef6f2961420dc3ca6ca\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`feedbacks\`
            ADD CONSTRAINT \`FK_8417be32ff262c67eada76acb56\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\`
            ADD CONSTRAINT \`FK_4c3d51cbf0535870b152f6c44f2\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_51a281693ebef6fa8729de39381\` FOREIGN KEY (\`shopId\`) REFERENCES \`shops\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_c0eda1f742fe1bd84c22df985b3\` FOREIGN KEY (\`industryId\`) REFERENCES \`industries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`shop_asserts\`
            ADD CONSTRAINT \`FK_ddfc233649de367f1b4c15558ef\` FOREIGN KEY (\`shopId\`) REFERENCES \`shops\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`shop_asserts\` DROP FOREIGN KEY \`FK_ddfc233649de367f1b4c15558ef\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_c0eda1f742fe1bd84c22df985b3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_51a281693ebef6fa8729de39381\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_Options\` DROP FOREIGN KEY \`FK_4c3d51cbf0535870b152f6c44f2\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`feedbacks\` DROP FOREIGN KEY \`FK_8417be32ff262c67eada76acb56\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`feedbacks\` DROP FOREIGN KEY \`FK_0e41cb96ef6f2961420dc3ca6ca\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`feedback_asserts\` DROP FOREIGN KEY \`FK_234a6f8394e7c1a29fe85cfd4dd\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_asserts\` DROP FOREIGN KEY \`FK_730b2706250e59bb6fbe88a2b1c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\`
        `);
        await queryRunner.query(`
            DROP TABLE \`shops\`
        `);
        await queryRunner.query(`
            DROP TABLE \`shop_asserts\`
        `);
        await queryRunner.query(`
            DROP TABLE \`industries\`
        `);
        await queryRunner.query(`
            DROP TABLE \`products\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product_Options\`
        `);
        await queryRunner.query(`
            DROP TABLE \`feedbacks\`
        `);
        await queryRunner.query(`
            DROP TABLE \`feedback_asserts\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product_asserts\`
        `);
    }

}
