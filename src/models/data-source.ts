import { DataSource } from "typeorm";
import {
    Location,
    User
} from "./entities";
import configuration from "../config";

const AppDataSource = new DataSource({
    type: "mysql",
    host: configuration.dbHost,
    port: configuration.dbPort,
    username: configuration.dbUsername,
    password: configuration.dbPassword,
    database: process.env.DB_BASE,
    entities: [
        User,
        Location
    ],
    migrationsRun: true,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    synchronize: false,
});

export default AppDataSource;
