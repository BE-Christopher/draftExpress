import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUserAndLocationTb1710723340812 implements MigrationInterface {
    name = 'InitUserAndLocationTb1710723340812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`locations\` (
                \`id\` int NOT NULL,
                \`address\` varchar(255) NOT NULL,
                \`street\` varchar(255) NOT NULL,
                \`district\` varchar(255) NOT NULL,
                \`ward\` varchar(255) NOT NULL,
                \`country\` varchar(255) NOT NULL,
                \`userId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` int NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`personalId\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL DEFAULT 'Registering User',
                \`birthDate\` datetime NULL,
                \`age\` int NULL,
                \`gender\` enum ('Male', 'Female', 'Unknown') NOT NULL DEFAULT 'Unknown',
                \`role\` enum ('Admin', 'Buyer', 'User') NOT NULL DEFAULT 'User',
                \`phone\` varchar(255) NULL,
                \`isVerified\` tinyint NOT NULL DEFAULT 0,
                \`isDeleted\` tinyint NOT NULL DEFAULT 0,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`locations\`
            ADD CONSTRAINT \`FK_78eda52dc27b7ad20350c4a752d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`locations\` DROP FOREIGN KEY \`FK_78eda52dc27b7ad20350c4a752d\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`locations\`
        `);
    }

}
