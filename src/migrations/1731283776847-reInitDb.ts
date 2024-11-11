import { MigrationInterface, QueryRunner } from "typeorm";

export class reInitDb1731283776847 implements MigrationInterface {
    name = 'reInitDb1731283776847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "day_ticket_period" ("id" SERIAL NOT NULL, "date" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'CT', "special" character varying, "one" character varying, "two" character varying, "three" text, "four" text, "five" character varying, "six" text, "seven" character varying, "eight" character varying, CONSTRAINT "PK_a2714423ec5e511d765d16c52b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."micro_data_location_enum" AS ENUM('CT')`);
        await queryRunner.query(`CREATE TYPE "public"."micro_data_aware_enum" AS ENUM('eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one', 'special')`);
        await queryRunner.query(`CREATE TYPE "public"."micro_data_unit_enum" AS ENUM('Unit', 'Ten', 'Hundred', 'Thousand', 'TenThousand', 'HundredThousand')`);
        await queryRunner.query(`CREATE TABLE "micro_data" ("id" SERIAL NOT NULL, "number" integer NOT NULL, "location" "public"."micro_data_location_enum" NOT NULL DEFAULT 'CT', "aware" "public"."micro_data_aware_enum" NOT NULL, "unit" "public"."micro_data_unit_enum" NOT NULL, "day" integer NOT NULL, "month" integer NOT NULL, "year" integer NOT NULL, CONSTRAINT "PK_d6718d0db34816c5c34b232e6f1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "micro_data"`);
        await queryRunner.query(`DROP TYPE "public"."micro_data_unit_enum"`);
        await queryRunner.query(`DROP TYPE "public"."micro_data_aware_enum"`);
        await queryRunner.query(`DROP TYPE "public"."micro_data_location_enum"`);
        await queryRunner.query(`DROP TABLE "day_ticket_period"`);
    }

}
