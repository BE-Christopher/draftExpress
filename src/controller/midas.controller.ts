import { Request, Response } from "express";

class MidasController {
    clockAngle(req: Request, res: Response) {
        try {
            const { time } = req.body;
            // parse str + convert number
            const [hour, minute] = String(time).split(':');
            const totalHour = Number(hour)
            const totalMinus = Number(minute) === 0 ? 12 : Number(minute) / 5

            // calculate angle
            const angle = (totalMinus - totalHour) * 30

            res.status(200);
            res.send(`angle between hour and minus is ${angle} degree`);
        } catch (error) {
            console.log('catch clockAngle err', error);

            res.status(500);
            res.send(error);
        }
    }

    remoteAssociate(req: Request, res: Response) { }

    snackAndLadder(req: Request, res: Response) { }

    dimensionTrip(req: Request, res: Response) { }
}

export default new MidasController();
