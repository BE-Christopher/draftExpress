import { awardNumbers, fiveDigitAware, fourDigitAware, LocationCode, sixDigitAware, threeDigitAware, twoDigitAware, TypeProcess, Units } from "./controller/dataProcess";
import initDataSource from "./models";
import AppDataSource from "./models/DataSource";
import MicroData from "./models/microData";
import dayTicket from "./repositories/dayTicket";
import microData from "./repositories/microData";

type splitData = {
    unit: Units,
    number: number;
};


const crawDBData = async ({
    locationCode,
    award
}: {
    locationCode: LocationCode,
    award: awardNumbers,
}) => {
    try {
        await initDataSource();
        const [items, total] = await dayTicket.getItems({
            // where: {
            //     type: locationCode,
            // },
            // select: {
            //     id: true,
            //     date: true,
            //     type: true,
            //     // ...(award === awardNumbers.EIGHT && { eight: true }),
            //     // ...(award === awardNumbers.SEVEN && { seven: true }),
            //     // ...(award === awardNumbers.SIX && { six: true }),
            //     // ...(award === awardNumbers.FIVE && { five: true }),
            //     // ...(award === awardNumbers.FOUR && { four: true }),
            //     // ...(award === awardNumbers.THREE && { three: true }),
            //     // ...(award === awardNumbers.TWO && { two: true }),
            //     // ...(award === awardNumbers.ONE && { one: true }),
            //     // ...(award === awardNumbers.SPECIAL && { special: true }),
            // }
        });
        console.log("🚀 ~ items:", items);

        return { items, total };
    } catch (error) {
        console.log("🚀 ~ error:", error);
        return { items: {} };
    }
};

const dataProcessing = async (award: awardNumbers, locationCode: LocationCode) => {
    // const pickValues = (item: DayTicketPeriod, award: awardNumbers) => {
    //     let values: string = '';
    //     switch (award) {
    //         case awardNumbers.EIGHT:
    //             values = item.eight;
    //             break;
    //         case awardNumbers.SEVEN:
    //             values = item.seven;
    //             break;
    //         case awardNumbers.SIX:
    //             values = item.six;
    //             break;
    //         case awardNumbers.FIVE:
    //             values = item.five;
    //             break;
    //         case awardNumbers.FOUR:
    //             values = item.four;
    //             break;
    //         case awardNumbers.THREE:
    //             values = item.three;
    //             break;
    //         case awardNumbers.TWO:
    //             values = item.two;
    //             break;
    //         case awardNumbers.ONE:
    //             values = item.one;
    //             break;
    //         default:
    //             values = item.special;
    //             break;
    //     }

    //     return values.split('');
    // };
    // const splitData = (values: string | string[], award: awardNumbers) => {
    //     const data: Array<splitData> = [];
    //     if (twoDigitAware.includes(award)) {
    //         const [unit, ten] = values;
    //         data.push(
    //             {
    //                 unit: Units.Unit,
    //                 number: Number(unit)
    //             },
    //             {
    //                 unit: Units.Ten,
    //                 number: Number(ten)
    //             }
    //         );
    //     }
    //     if (threeDigitAware.includes(award)) {
    //         const [unit, ten, hundred] = values;
    //         data.push(
    //             {
    //                 unit: Units.Unit,
    //                 number: Number(unit)
    //             },
    //             {
    //                 unit: Units.Ten,
    //                 number: Number(ten)
    //             },
    //             {
    //                 unit: Units.Hundred,
    //                 number: Number(hundred)
    //             }
    //         );
    //     }
    //     if (fourDigitAware.includes(award)) {
    //         const pickValues = (value: string) => {
    //             const [unit, ten, hundred, thousand] = value;
    //             data.push(
    //                 {
    //                     unit: Units.Unit,
    //                     number: Number(unit)
    //                 },
    //                 {
    //                     unit: Units.Ten,
    //                     number: Number(ten)
    //                 },
    //                 {
    //                     unit: Units.Hundred,
    //                     number: Number(hundred)
    //                 },
    //                 {
    //                     unit: Units.Thousand,
    //                     number: Number(thousand)
    //                 },
    //             );
    //         };

    //         Array.isArray(values) ? values.forEach(value => pickValues(value)) : pickValues(values);
    //     }
    //     if (fiveDigitAware.includes(award)) {
    //         const pickValues = (value: string) => {
    //             const [unit, ten, hundred, thousand, tenThousand] = value;
    //             data.push(
    //                 {
    //                     unit: Units.Unit,
    //                     number: Number(unit)
    //                 },
    //                 {
    //                     unit: Units.Ten,
    //                     number: Number(ten)
    //                 },
    //                 {
    //                     unit: Units.Hundred,
    //                     number: Number(hundred)
    //                 },
    //                 {
    //                     unit: Units.Thousand,
    //                     number: Number(thousand)
    //                 },
    //                 {
    //                     unit: Units.TenThousand,
    //                     number: Number(tenThousand)
    //                 },
    //             );
    //         };

    //         Array.isArray(values) ? values.forEach(value => pickValues(value)) : pickValues(values);
    //     }
    //     if (sixDigitAware.includes(award)) {
    //         const [unit, ten, hundred, thousand, tenThousand, hundredThousand] = values;
    //         data.push(
    //             {
    //                 unit: Units.Unit,
    //                 number: Number(unit)
    //             },
    //             {
    //                 unit: Units.Ten,
    //                 number: Number(ten)
    //             },
    //             {
    //                 unit: Units.Hundred,
    //                 number: Number(hundred)
    //             },
    //             {
    //                 unit: Units.Thousand,
    //                 number: Number(thousand)
    //             },
    //             {
    //                 unit: Units.TenThousand,
    //                 number: Number(tenThousand)
    //             },
    //             {
    //                 unit: Units.HundredThousand,
    //                 number: Number(hundredThousand)
    //             },
    //         );
    //     }

    //     return data;
    // };

    // main process
    try {
        // get source data
        const { items } = await crawDBData({
            locationCode,
            award
        });
        // console.log("🚀 ~ dataProcessing ~ items:", items);

        // loop for initialing data
        // for (const item of items) {
        //     const newMicroData: Promise<Partial<MicroData> & MicroData>[] = [];

        //     // pitching date 02/01/2008
        //     const date = item.date;
        //     const [day, month, year] = date.split('/');
        //     console.log("🚀 ~ dataProcessing ~ day, month, year:", day, month, year);

        //     // priceValuePicking
        //     const values = pickValues(item, award);
        //     const data: splitData[] = splitData(values, award);
        //     console.log("🚀 ~ dataProcessing ~ values:", values);
        //     console.log("🚀 ~ dataProcessing ~ data:", data);

        //     data.forEach((element) => {
        //         const newItem = microData.initOne({
        //             day: Number(day),
        //             month: Number(month),
        //             year: Number(year),
        //             location: LocationCode.CT,
        //             aware: award,
        //             ...element
        //         });
        //         newMicroData.push(newItem);
        //     });

        //     // await Promise.all(newMicroData);
        // }
        console.log('>>>>>>>>>>>>>>>>>>>>>>>Function running done<<<<<<<<<<<<<<<<<<<<<<<<<');
    } catch (error) {
        console.log("🚀 ~ dataProcessing ~ error:", error);
    }
};

dataProcessing(awardNumbers.EIGHT, LocationCode.CT);