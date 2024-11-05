import { MigrationInterface, QueryRunner } from "typeorm";

export class dayTicketTableInit1730602159980 implements MigrationInterface {
    name = 'dayTicketTableInit1730602159980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`day_ticket_period\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL DEFAULT 'CT', \`special\` varchar(255) NULL, \`one\` varchar(255) NULL, \`two\` varchar(255) NULL, \`three\` text NULL, \`four\` text NULL, \`five\` varchar(255) NULL, \`six\` text NULL, \`seven\` varchar(255) NULL, \`eight\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`day_ticket_period\``);
    }

}
