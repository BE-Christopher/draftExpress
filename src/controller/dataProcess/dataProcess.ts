import { addDays, format, isFriday, isMonday, isSaturday, isSunday, isThursday, isTuesday, isWednesday } from "date-fns";
import csvProcess from "./csvProcess";
import { DayPercent, DaysName, generateAllDateInYear, generateDatePercent, generateMonthPercent, generatePercent, generateYearPercent, MonthPercent, MonthsIndex, MonthsName, originSourceNb, SimplePercent, YearPercent, YearTicketPeriod } from "./dataProcess.interface";

const dataProcess = () => {
    const fileProcess = csvProcess();

    const checkDate = (day: DaysName) => {
        switch (day) {
            case DaysName.Mon:
                return isMonday;

            case DaysName.Tue:
                return isTuesday;

            case DaysName.Wed:
                return isWednesday;

            case DaysName.Thu:
                return isThursday;

            case DaysName.Fri:
                return isFriday;

            case DaysName.Sat:
                return isSaturday;

            case DaysName.Sun:
                return isSunday;
            default:
                return isMonday;
        }
    };

    const generateSourceDate = ({
        day,
        year
    }: generateAllDateInYear) => {
        // generate start and end dates
        const startDateOfYear = new Date(year, 0, 1);
        const endDateOfYear = new Date(year, 11, 31);
        const result = [];
        // switch check month case
        const pitchingDay = checkDate(day);


        let indexDate = pitchingDay(startDateOfYear) ? startDateOfYear : addDays(startDateOfYear, (8 - startDateOfYear.getDay()) % 7);

        while (indexDate <= endDateOfYear) {
            const pushingDate = format(indexDate, 'dd MM yyyy');
            result.push(pushingDate);
            indexDate = addDays(indexDate, 7);
        }

        return result;
    };


    const countNumber = (csvData: any): SimplePercent => {
        const countNumberInString = (str: string, nb: number): number => str.split(nb.toString()).length - 1;

        // init draft format
        const simplePercent: SimplePercent = originSourceNb.map((number) => {
            let special: number = 0;
            let one: number = 0;
            let two: number = 0;
            let three: number = 0;
            let four: number = 0;
            let five: number = 0;
            let six: number = 0;
            let seven: number = 0;
            let eight: number = 0;
            csvData.forEach((element: any) => {
                special += countNumberInString(element.special, number);
                one += countNumberInString(element.one, number);
                two += countNumberInString(element.two, number);
                three += countNumberInString(element.three, number);
                four += countNumberInString(element.four, number);
                five += countNumberInString(element.five, number);
                six += countNumberInString(element.six, number);
                seven += countNumberInString(element.seven, number);
                eight += countNumberInString(element.eight, number);
            });
            const total = special + one + two + three + four + five + six + seven + eight;

            return {
                number,
                percent: total / csvData.length,
                total
            };
        });

        return simplePercent;
    };

    // generate Statistic
    const generateSimplePercent = async ({ outputFilePath, sourceFilePath }: generatePercent) => {

        try {
            // read source file
            const csvData: YearTicketPeriod = await fileProcess.csv2Arr(sourceFilePath);
            if (!csvData) throw Error;

            const simplePercent = countNumber(csvData);

            // write file
            await fileProcess.writeCsvFile(outputFilePath, simplePercent);

            console.log('>>>>>>>>>>>>>>>>>>Generated File<<<<<<<<<<<<<<<<<<<<<<<<<<');

            return simplePercent;

        } catch (error) {
            console.log("🚀 ~ generateSimplePercent ~ error:", error);
            return error;
        }
    };

    const generateByDate = async ({
        outputFilePath,
        sourceFilePath,
        days
    }: generateDatePercent) => {
        try {
            const data: DayPercent = [];

            // loop to read list file
            sourceFilePath.forEach(async (file) => {
                const csvData: YearTicketPeriod = await fileProcess.csv2Arr(file);
                days.forEach((day) => {
                    const pitchingFunc = checkDate(day);
                    const csvFilter = csvData.filter((records) => pitchingFunc(new Date(records.date)));
                    data.push({
                        day,
                        numbers: countNumber(csvFilter)
                    });
                });
            });

            // write file
            await fileProcess.writeCsvFile(outputFilePath, data);

            return data;
        } catch (error) {
            console.log("🚀 ~ dataProcess ~ error:", error);
            return error;
        }
    };

    const generateByMonth = async ({
        outputFilePath,
        sourceFilePath,
    }: generateMonthPercent) => {
        try {
            const data: MonthPercent = [];

            // loop to read list file
            sourceFilePath.forEach(async (file) => {
                const csvData: YearTicketPeriod = await fileProcess.csv2Arr(file);

                for (const month in MonthsIndex) {
                    const monthFilter = csvData.filter((data) => format(new Date(data.date), 'MM') === MonthsIndex[month as keyof typeof MonthsIndex]);
                    data.push({
                        month: month as MonthsName,
                        numbers: countNumber(monthFilter)
                    });
                }
            });

            // write file
            await fileProcess.writeCsvFile(outputFilePath, data);
            return data;
        } catch (error) {
            console.log("🚀 ~ dataProcess ~ error:", error);
            return error;
        }
    };

    const generateByYear = async ({ outputFilePath, sourceFilePath }: generateYearPercent) => {
        try {
            // 
            const data: YearPercent = [];

            // loop to read list file
            sourceFilePath.forEach(async (file) => {
                const csvData: YearTicketPeriod = await fileProcess.csv2Arr(file);
                const year: number = Number(format(new Date(csvData[0].date), 'yyyy'));

                data.push({
                    year,
                    numbers: countNumber(csvData)
                });
            });

            // write file
            await fileProcess.writeCsvFile(outputFilePath, data);

            return data;
        } catch (error) {
            console.log("🚀 ~ generateByYear ~ error:", error);
            return error;
        }
    };

    return {
        generateSourceDate,
        generateSimplePercent,
        generateByYear,
        generateByMonth,
        generateByDate,
    };
};

export default dataProcess;