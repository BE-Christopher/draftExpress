import { join } from "path";
import { DaysName } from "./controller/dataProcess";
import dataProcess from "./controller/dataProcess/dataProcess";

const ticketDataProcess = async () => {
    const {
        generateByDate,
        generateByMonth,
        generateByYear,
        generateSimplePercent,
        generateSourceDate
    } = dataProcess();

    const allWednesday = generateSourceDate({
        day: DaysName.Wed,
        year: 2024
    });

    const fileName = '';
    const sourceFileFolder = join(__dirname, '../dist/sources');
    const sourceFilePath = join(sourceFileFolder, fileName);

    const outputFileFolder = join(__dirname, '../dist/out');
    const outputFilePath = join(outputFileFolder, `simple_percent_statistic_for_${fileName}`);



    await generateSimplePercent({
        outputFilePath,
        sourceFilePath
    });
};

ticketDataProcess();