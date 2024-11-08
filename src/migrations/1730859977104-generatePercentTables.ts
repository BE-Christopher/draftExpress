import { MigrationInterface, QueryRunner } from "typeorm";

export class generatePercentTables1730859977104 implements MigrationInterface {
    name = 'generatePercentTables1730859977104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`constants\` (\`id\` int NOT NULL AUTO_INCREMENT, \`totalDates\` int NOT NULL DEFAULT '0', \`totalSpecial\` int NOT NULL DEFAULT '0', \`totalOne\` int NOT NULL DEFAULT '0', \`totalTwo\` int NOT NULL DEFAULT '0', \`totalThree\` int NOT NULL DEFAULT '0', \`totalFour\` int NOT NULL DEFAULT '0', \`totalFive\` int NOT NULL DEFAULT '0', \`totalSix\` int NOT NULL DEFAULT '0', \`totalSeven\` int NOT NULL DEFAULT '0', \`totalEight\` int NOT NULL DEFAULT '0', \`latestCrawlingDate\` varchar(255) NULL DEFAULT '', \`locationCode\` enum ('CT') NOT NULL DEFAULT 'CT', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`simple_percent\` (\`id\` int NOT NULL AUTO_INCREMENT, \`award\` enum ('eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one', 'special') NOT NULL, \`hundredThousand\` int NULL DEFAULT '0', \`tenThousand\` int NULL DEFAULT '0', \`thousand\` int NULL DEFAULT '0', \`hundred\` int NULL DEFAULT '0', \`ten\` int NULL DEFAULT '0', \`unit\` int NULL DEFAULT '0', \`calculateBy\` enum ('TotalDate', 'TotalAware') NOT NULL DEFAULT 'TotalDate', \`numberId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`month_percent\` (\`id\` int NOT NULL AUTO_INCREMENT, \`award\` enum ('eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one', 'special') NOT NULL, \`month\` enum ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec') NOT NULL, \`hundredThousand\` int NULL DEFAULT '0', \`tenThousand\` int NULL DEFAULT '0', \`thousand\` int NULL DEFAULT '0', \`hundred\` int NULL DEFAULT '0', \`ten\` int NULL DEFAULT '0', \`unit\` int NULL DEFAULT '0', \`calculateBy\` enum ('TotalDate', 'TotalAware') NOT NULL DEFAULT 'TotalDate', \`numberId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`year_pecent\` (\`id\` int NOT NULL AUTO_INCREMENT, \`year\` int NOT NULL, \`award\` enum ('eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one', 'special') NOT NULL, \`hundredThousand\` int NULL DEFAULT '0', \`tenThousand\` int NULL DEFAULT '0', \`thousand\` int NULL DEFAULT '0', \`hundred\` int NULL DEFAULT '0', \`ten\` int NULL DEFAULT '0', \`unit\` int NULL DEFAULT '0', \`calculateBy\` enum ('TotalDate', 'TotalAware') NOT NULL DEFAULT 'TotalDate', \`numberId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`numberList\` (\`id\` int NOT NULL AUTO_INCREMENT, \`number\` int NOT NULL, \`locationCode\` enum ('CT') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`simple_percent\` ADD CONSTRAINT \`FK_a560f99b94754e0a55167969d67\` FOREIGN KEY (\`numberId\`) REFERENCES \`numberList\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`month_percent\` ADD CONSTRAINT \`FK_e11c26e861f99b7045a567f6b21\` FOREIGN KEY (\`numberId\`) REFERENCES \`numberList\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`year_pecent\` ADD CONSTRAINT \`FK_09fa33f538cd0f644b16d56b386\` FOREIGN KEY (\`numberId\`) REFERENCES \`numberList\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`year_pecent\` DROP FOREIGN KEY \`FK_09fa33f538cd0f644b16d56b386\``);
        await queryRunner.query(`ALTER TABLE \`month_percent\` DROP FOREIGN KEY \`FK_e11c26e861f99b7045a567f6b21\``);
        await queryRunner.query(`ALTER TABLE \`simple_percent\` DROP FOREIGN KEY \`FK_a560f99b94754e0a55167969d67\``);
        await queryRunner.query(`DROP TABLE \`numberList\``);
        await queryRunner.query(`DROP TABLE \`year_pecent\``);
        await queryRunner.query(`DROP TABLE \`month_percent\``);
        await queryRunner.query(`DROP TABLE \`simple_percent\``);
        await queryRunner.query(`DROP TABLE \`constants\``);
    }

}
