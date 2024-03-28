import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import routers from './routers';
import AppDataSource from './models/data-source';
import { realTimeServer } from './controller/realTime';

const app = express();
const port = 3009;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routers.getRoutes());

// db connect
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

// init real-time service
realTimeServer.init();

app.get('/', (req, res) => {
    res.send('Welcome to draftExpress!');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
