import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import routers from './routers';

const app = express();
const port = 3009;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routers.getRoutes());

app.get('/', (req, res) => {
    res.send('Welcome to draftExpress!');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
