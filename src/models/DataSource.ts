import { DataSource } from "typeorm";
import DayTicketPeriod from "./dayTicketPeriod";
import MicroData from "./microData";

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'my_user',
    password: 'my_password',
    database: 'my_database',
    entities: [
        DayTicketPeriod,
        MicroData
    ],
    synchronize: false,
    logging: true,
    migrations: ["src/migrations/*{.ts,.js}"],
    subscribers: ['src/subscriber/**/*.ts'],
    driver: {}
});

export default AppDataSource;