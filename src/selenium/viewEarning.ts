import { WebDriver } from "selenium-webdriver";
import * as fs from 'fs';
import { format } from "date-fns";

export interface IIncreaseViewData {
    name: string;
    url: string;
    expectIncrease: number;
    maxTimeViewing: number;
}

export interface IReportItem {
    name: string;
    url: string;
    dateIncrease: string;
    totalViewIncrease: number;
}

export interface IViewEarning {
    drive: WebDriver,
    data: Array<IIncreaseViewData>;
    reportFilePath: string;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const viewEarning = async ({
    drive,
    data,
    reportFilePath
}: IViewEarning) => {
    let totalIncrease: number = 0;
    let flag: boolean = false;
    let flagCount = 0;
    let triggerFlagCount = Math.floor(Math.random() * (10)) + 1;
    try {
        // loop into list video increasing
        for (let i = 0; i < data.length; i++) {
            const increasingVideo = data[i];

            // loop, increase views
            while (totalIncrease != increasingVideo.expectIncrease) {
                // open new window to daily motion
                await drive.get(increasingVideo.url);
                // watching time
                const timeWatching = Math.floor(Math.random() * (increasingVideo.maxTimeViewing - 59)) + 59;
                await drive.sleep(timeWatching);

                // close drive
                await drive.quit();

                // increase variables
                totalIncrease += 1;
                // check and trigger or increase random stop
                flag = flagCount === triggerFlagCount;
                flag ? async () => {
                    const waitTime = Math.floor(Math.random() * (10 * 60 * 1000 - 5 * 60 * 1000)) + 5 * 60 * 1000;
                    console.log(`Waiting for ${waitTime / 1000} seconds before the next iteration...`);
                    await wait(waitTime);
                    flagCount = 0;
                    flag = false;
                    triggerFlagCount = Math.floor(Math.random() * (10)) + 1;
                } : flagCount++;
            }

            // write report file
            const isReportFileExisted = fs.existsSync(reportFilePath);
            const reportContent: Array<IReportItem> = isReportFileExisted ? JSON.parse(String(fs.readFileSync(reportFilePath))) : [];

            const newItem: IReportItem = {
                dateIncrease: format(new Date(), 'yyyy-mm-dd hh:mm:ss'),
                name: increasingVideo.name,
                totalViewIncrease: totalIncrease,
                url: increasingVideo.url
            };

            reportContent.push(newItem);
            fs.writeFileSync(reportFilePath, JSON.stringify(reportContent));
        }
    } catch (error) {
        console.log("🚀 ~ viewEarning ~ error:", error);
    }
};