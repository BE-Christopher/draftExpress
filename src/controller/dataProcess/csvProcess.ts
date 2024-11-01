import csvParser = require('csv-parser');
import * as fs from 'fs';


const csvProcess = () => {

    const csv2Arr = async (filePath: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const result: any[] = [];

            // read and convert file
            fs
                .createReadStream(filePath)
                .pipe(
                    csvParser({ mapHeaders: ({ header }) => header.replace(/\s+/g, '').toLowerCase() })
                )
                .on('data', (data: any) => result.push(data))
                .on('end', () => resolve(result))
                .on('error', (error: any) => reject(error));
        });
    };

    const writeCsvFile = (outputFilePath: string, data: any) => {
        return new Promise((reject, resolve) => {
            fs.writeFile(outputFilePath, data, 'utf-8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    return {
        csv2Arr,
        writeCsvFile
    };
};

export default csvProcess;