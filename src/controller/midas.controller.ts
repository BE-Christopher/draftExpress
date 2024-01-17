import { Request, Response } from "express";

// interfaces - type define
type boardItem = {
    row: number,
    col: number,
    index: number,
};

type boardCard = boardItem[];

type inputDataItem = [number, number];
type listInputData = inputDataItem[];

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

    snackAndLadder(req: Request, res: Response) {
        try {
            const maxStepCanRun = 6;
            const board: boardCard = [];

            const { ladderPosition, snakesPosition } = req.body;
            // validation input data
            if (!Array.isArray(ladderPosition)) {
                throw new Error('Invalid format');
            }

            if (!Array.isArray(snakesPosition)) {
                throw new Error('Invalid format');
            }
            // init template
            let row = 0;
            let currentIndex = 1;
            while (row < 10) {
                let col = 0;
                while (col < 10) {
                    board.push({
                        row,
                        col,
                        index: currentIndex
                    });
                    currentIndex += 1;
                    col += 1;
                }
                row += 1;
                col = 0;
            }

            // run game
            // init default value
            const minimumResult = [];
            let cursor: boardItem = {
                col: 0,
                row: 0,
                index: 1
            };

            // game runing
            while (cursor.index < 100) {
                let nearestLadder: any, pointUpTo: any, nearestSnack: any, pointDownTo: any;
                // get nearest ladder
                ladderPosition.length && ladderPosition.find((item) => {
                    if (!item) {
                        return false;
                    }
                    const [draftPointUp, draftPointUpTo] = item;
                    if (draftPointUp > cursor.index) {
                        nearestLadder = draftPointUp;
                        pointUpTo = draftPointUpTo;
                        return true;
                    } else {
                        // ladderPosition.shift();
                        return false;
                    }
                });

                // get nearest snack
                snakesPosition.length && snakesPosition.find((item) => {
                    if (!item) {
                        return false;
                    }
                    const [draftPointDown, draftPointDownTo] = item;
                    if (draftPointDown > cursor.index) {
                        nearestSnack = draftPointDown;
                        pointDownTo = draftPointDownTo;
                        return true;
                    } else {
                        // snakesPosition.shift();
                        return false;
                    }
                });

                // calculate dice
                const totalStepToLadder = nearestLadder ? nearestLadder - cursor.index : 100 - cursor.index;
                const totalStepToSnack = nearestSnack ? nearestSnack - cursor.index : undefined;

                // check and calculate step
                let moves = undefined;
                if (totalStepToLadder) {
                    moves = totalStepToLadder >= maxStepCanRun ? maxStepCanRun : totalStepToLadder;
                }
                else {
                    moves = cursor.index < 100 - maxStepCanRun ? maxStepCanRun : 100 - cursor.index;
                }
                if (!moves) { throw new Error('Incorrect algorism calculate moves'); }

                totalStepToSnack && moves === totalStepToSnack ? moves -= 1 : null;
                // break;

                minimumResult.push(moves);

                // calculate and reSet new cursor
                let newIndex = cursor.index += moves;

                // check up ladder
                if (newIndex === nearestLadder) { newIndex = pointUpTo; }
                console.log('\n');

                // calculate new cursor
                const tens = Math.floor(newIndex / 10);
                const units = newIndex % 10;
                cursor = {
                    col: units - 1,
                    index: newIndex,
                    row: tens - 1,
                };
            }

            res.status(200);
            res.send(minimumResult);
        } catch (error) {
            console.log('catch remoteAssociate err', error);

            res.status(500);
            res.send(error);
        }
    }

    dimensionTrip(req: Request, res: Response) {
        try {
            const { start, shops, stations, target } = req.body;

            const position = [start, ...shops, ...stations, target];
            const n = position.length;

            // calculate energy
            const calculateEnergy = (from: number, to: number) => Math.abs(position[from] - position[to]);

            const minimumResult: number[] = Array(n).fill(Number.MAX_SAFE_INTEGER);
            minimumResult[0] = 0;

            for (let i = 1; i < n; i++) {
                for (let j = 0; j < i; j++) {
                    const energyToMove = calculateEnergy(i, j);
                    minimumResult[i] = Math.min(minimumResult[i], minimumResult[j] + energyToMove);
                }
            }

            res.status(200);
            res.send(`Minimum energy: ${minimumResult[n - 2]}`);
        } catch (error) {
            console.log('catch clockAngle err', error);

            res.status(500);
            res.send(error);
        }
    }
}

export default new MidasController();
