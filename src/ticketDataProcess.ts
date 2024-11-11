import 'chromedriver';
import { format, parse } from 'date-fns';
import { Builder, By } from "selenium-webdriver";
import { DaysName, DayTicketPeriodInterface, yearCawing } from './controller/dataProcess';
import dataProcess from "./controller/dataProcess/dataProcess";
import AppDataSource from './models/DataSource';
import DayTickerRepository from './repositories/dayTicket';
import * as chrome from 'selenium-webdriver/chrome';

type storeValue = {
    g1: string,
    g2: string,
    g3: string[],
    g4: string[],
    g5: string,
    g6: string[],
    g7: string,
    g8: string,
    db: string;
};

const ticketDataProcess = async () => {
    await AppDataSource.initialize();
    const errDay = [];

    const {
        generateByDate,
        generateByMonth,
        generateByYear,
        generateSimplePercent,
        generateSourceDate
    } = dataProcess();

    // generate crawling days
    let allWednesday: string[] = [];
    yearCawing.forEach((year) => {
        const allDayInYear = generateSourceDate({
            day: DaysName.Wed,
            year: year
        });
        allWednesday = [...allWednesday, ...allDayInYear];
    });

    console.log('>>>>>>>>>>>>>>>>', allWednesday.join('\n'));


    for (const day of allWednesday) {
        const dayRepo = new DayTickerRepository();

        // open page
        const inputDate = parse(day, 'dd/MM/yyyy', new Date());
        const pathDate = format(inputDate, 'd-M-yyyy');
        const pagePath = `https://xskt.com.vn/xsct/ngay-${pathDate}`;
        const options = new chrome.Options();
        options.addArguments('--headless');
        options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        const drive = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        try {
            await drive.get(pagePath);
            await drive.manage().setTimeouts({ implicit: 10000 });

            // goto table
            const table = await drive.findElement(By.css('table.result#CT0'));
            const rows = await table.findElements(By.css('tbody tr'));
            const values: storeValue = {
                db: '',
                g1: '',
                g2: '',
                g3: [],
                g4: [],
                g5: '',
                g6: [],
                g7: '',
                g8: ''
            };

            // loop to rows
            for (let row of rows) {
                let columns = await row.findElements(By.css('td'));
                if (columns.length > 1) {
                    const checkingCol = await columns[0].getText();
                    const valueCol = await columns[1].getText();
                    switch (checkingCol) {
                        case 'G8':
                            values['g8'] = valueCol;
                            break;
                        case 'G7':
                            values['g7'] = valueCol;
                            break;
                        case 'G6':
                            values['g6'] = valueCol.split(' ');
                            break;
                        case 'G5':
                            values['g5'] = valueCol;
                            break;
                        case 'G4':
                            values['g4'] = valueCol.replace(/\n/g, ' ').split(' ');
                            break;
                        case 'G3':
                            values['g3'] = valueCol.split(' ');
                            break;
                        case 'G2':
                            values['g2'] = valueCol;
                            break;
                        case 'G1':
                            values['g1'] = valueCol;
                            break;
                        case 'ĐB':
                            values['db'] = valueCol;
                            break;
                    }

                }
            }

            await dayRepo.saveItem({
                date: day,
                one: values.g1,
                two: values.g2,
                three: JSON.stringify(values.g3),
                four: JSON.stringify(values.g4),
                five: values.g5,
                six: JSON.stringify(values.g6),
                seven: values.g7,
                eight: values.g8,
                special: values.db
            });

            console.log(`>>>>>>>>>>>>>>>>>>>>Successfully push item for day ${day}: ${values}`);
            await drive.close();
        } catch (error) {
            console.log("🚀 ~ ticketDataProcess ~ error:", error);
            errDay.push(day);
            await drive.close;
        }
    };
    console.log("Error When crawler running: ", errDay);
    return true;
};

const reImportErrDate = async () => {
    const missingItem = [
        // '06/02/2008',
        // '13/02/2008',
        // '30/01/2008',
        '01/04/2009',
        '28/08/2013',
        '14/07/2021',
        '21/07/2021',
        '28/07/2021',
        '04/08/2021',
        '11/08/2021',
        '18/08/2021',
        '25/08/2021',
        '01/09/2021',
        '08/09/2021',
        '15/09/2021',
        '22/09/2021',
        '29/09/2021',
        '06/10/2021',
        '13/10/2021',
        '20/10/2021',
        '30/10/2024',
    ];
    const errDay = [];


    for (const day of missingItem) {
        const dayRepo = new DayTickerRepository();

        // open page
        const inputDate = parse(day, 'dd/MM/yyyy', new Date());
        const pathDate = format(inputDate, 'd-M-yyyy');
        const pagePath = `https://xskt.com.vn/xsct/ngay-${pathDate}`;
        const options = new chrome.Options();
        options.addArguments('--headless');
        options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        const drive = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        try {
            await drive.get(pagePath);
            await drive.manage().setTimeouts({ implicit: 10000 });

            // goto table
            const table = await drive.findElement(By.css('table.result#CT0'));
            const rows = await table.findElements(By.css('tbody tr'));
            const values: storeValue = {
                db: '',
                g1: '',
                g2: '',
                g3: [],
                g4: [],
                g5: '',
                g6: [],
                g7: '',
                g8: ''
            };

            // loop to rows
            for (let row of rows) {
                let columns = await row.findElements(By.css('td'));
                if (columns.length > 1) {
                    const checkingCol = await columns[0].getText();
                    const valueCol = await columns[1].getText();
                    switch (checkingCol) {
                        case 'G8':
                            values['g8'] = valueCol;
                            break;
                        case 'G7':
                            values['g7'] = valueCol;
                            break;
                        case 'G6':
                            values['g6'] = valueCol.split(' ');
                            break;
                        case 'G5':
                            values['g5'] = valueCol;
                            break;
                        case 'G4':
                            values['g4'] = valueCol.replace(/\n/g, ' ').split(' ');
                            break;
                        case 'G3':
                            values['g3'] = valueCol.split(' ');
                            break;
                        case 'G2':
                            values['g2'] = valueCol;
                            break;
                        case 'G1':
                            values['g1'] = valueCol;
                            break;
                        case 'ĐB':
                            values['db'] = valueCol;
                            break;
                    }

                }
            }

            await dayRepo.saveItem({
                date: day,
                one: values.g1,
                two: values.g2,
                three: JSON.stringify(values.g3),
                four: JSON.stringify(values.g4),
                five: values.g5,
                six: JSON.stringify(values.g6),
                seven: values.g7,
                eight: values.g8,
                special: values.db
            });

            console.log(`>>>>>>>>>>>>>>>>>>>>Successfully push item for day ${day}: ${values}`);
            await drive.close();
        } catch (error) {
            console.log("🚀 ~ ticketDataProcess ~ error:", error);
            errDay.push(day);
            await drive.close();
        }
    }

    console.log('Error When crawler running: ', errDay);

};

reImportErrDate();
// ticketDataProcess();