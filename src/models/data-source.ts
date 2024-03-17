import { DataSource } from "typeorm";
import { User } from "./entities";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "MysqlJackson",
    database: "draft_ecommerce",
    entities: [
        User
    ],
    migrationsRun: true,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    synchronize: false,
});

export default AppDataSource;
