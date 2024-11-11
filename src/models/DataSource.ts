import { DataSource } from "typeorm";
import DayTicketPeriod from "./dayTicketPeriod";
import MicroData from "./microData";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'user',
    password: 'password',
    database: 'my_database',
    entities: [
        DayTicketPeriod,
        MicroData
    ],
    synchronize: false,
    logging: true,
    migrations: ["src/migrations/*{.ts,.js}"],
    subscribers: ['src/subscriber/**/*.ts'],
});

export default AppDataSource;