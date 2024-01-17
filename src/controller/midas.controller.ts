import { Request, Response } from "express";

// interfaces - type define
type boardItem = {
    row: number,
    col: number,
    index: number,
};

type boardCard = boardItem[];

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

            const [srt1, str2] = listStr.map(String);

            const commonChar = [...new Set(srt1)].filter((char) => str2.includes(char)).join('');
            const resultSrt = listStr.join(',').replace(/\s/g, '').replace(new RegExp(commonChar, 'g'), '');

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

            // init board template
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 10; col++) {
                    const index = row * 10 + col + 1;
                    board.push({
                        row,
                        col,
                        index
                    });
                }
            }

            // run game
            // init default value
            const minimumResult: number[] = [];
            let cursor: boardItem = {
                col: 0,
                row: 0,
                index: 1
            };

            // get merest item
            const getNearestItem = (baseArr: [number, number][], currentIndex: number) => {
                for (const [draftPoint, draftPointTo] of baseArr) {
                    if (draftPoint > currentIndex) {
                        return [draftPoint, draftPointTo];
                    }
                }
                return [undefined, undefined];
            };

            const calculateNewCursor = (index: number) => {
                const tens = Math.floor(index / 10);
                const units = index % 10;
                return {
                    col: units - 1,
                    index: index,
                    row: tens - 1,
                };
            };

            // game runing
            while (cursor.index < 100) {
                const [nearestLadder, pointUpTo] = getNearestItem(ladderPosition, cursor.index);
                const [nearestSnack, pointDownTo] = getNearestItem(snakesPosition, cursor.index);

                // calculate dice
                const totalStepToLadder = nearestLadder ? nearestLadder - cursor.index : 100 - cursor.index;
                const totalStepToSnack = nearestSnack ? nearestSnack - cursor.index : undefined;

                // check and calculate step
                let moves = totalStepToLadder ? Math.min(totalStepToLadder, maxStepCanRun) : Math.min(maxStepCanRun, 100 - cursor.index);
                if (!moves) { throw new Error('Incorrect algorism calculate moves'); }

                totalStepToSnack && moves === totalStepToSnack ? moves -= 1 : null;
                // break;

                minimumResult.push(moves);

                // calculate and reSet new cursor
                let newIndex = cursor.index += moves;

                // check up ladder
                if (newIndex === nearestLadder && pointUpTo) { newIndex = pointUpTo; }

                // calculate new cursor
                cursor = calculateNewCursor(newIndex);
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
