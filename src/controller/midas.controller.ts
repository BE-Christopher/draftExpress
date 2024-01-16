import { Request, Response } from "express";

class MidasController {
    clockAngle(req: Request, res: Response) {
        try {
            const { time } = req.body;
            // parse str + convert number
            const [hour, minute] = String(time).split(':');
            const totalHour = Number(hour) > 12 ? Number(hour) - 12 : Number(hour);
            const totalMinus = Number(minute) === 0 ? 12 : Number(minute) / 5;

            // calculate angle
            const angle = (totalMinus - totalHour) * 30;

            res.status(200);
            res.send(`angle between hour and minus is ${angle} degree`);
        } catch (error) {
            console.log('catch clockAngle err', error);

            res.status(500);
            res.send(error);
        }
    }

    remoteAssociate(req: Request, res: Response) {
        try {
            const { listStr } = req.body;
            if (!Array.isArray(listStr)) {
                throw new Error('listStr must be a string array');
            }

            // find relation srt
            let relationSrt = '';
            for (let i = 0; i < String(listStr[0]).length; i++) {
                if (String(listStr[1]).includes(String(listStr[0])[i])) relationSrt += String(listStr[0])[i];
            }

            const draftStr = listStr.join(',').replace(/\s/g, "");
            const resultSrt = draftStr.replace(new RegExp(relationSrt, 'g'), '');

            res.status(200);
            res.send(resultSrt.split(','));
        } catch (error) {
            console.log('catch remoteAssociate err', error);

            res.status(500);
            res.send(error);
        }
    }

    snackAndLadder(req: Request, res: Response) { }

    dimensionTrip(req: Request, res: Response) { }
}

export default new MidasController();
