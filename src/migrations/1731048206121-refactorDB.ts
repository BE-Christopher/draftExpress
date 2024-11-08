import { MigrationInterface, QueryRunner } from "typeorm";

export class refactorDB1731048206121 implements MigrationInterface {
    name = 'refactorDB1731048206121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`micro_data\` (\`id\` int NOT NULL AUTO_INCREMENT, \`number\` int NOT NULL, \`location\` enum ('CT') NOT NULL DEFAULT 'CT', \`aware\` enum ('eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one', 'special') NOT NULL, \`unit\` enum ('Unit', 'Ten', 'Hundred', 'Thousand', 'TenThousand', 'HundredThousand') NOT NULL, \`day\` int NOT NULL, \`month\` int NOT NULL, \`year\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`micro_data\``);
    }

}
