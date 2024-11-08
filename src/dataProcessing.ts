import { awardNumbers, LocationCode, TypeProcess } from "./controller/dataProcess";
import DayTicketPeriod from "./models/dayTicketPeriod";
import dayTicket from "./repositories/dayTicket";

const dataProcessing = async () => {
    const crawDBData = async ({
        locationCode,
        award
    }: {
        locationCode: LocationCode,
        award: awardNumbers,
    }) => {
        const [items, total] = await dayTicket.getItems({
            where: {
                type: locationCode,
            },
            select: {
                id: true,
                date: true,
                type: true,
                ...(award === awardNumbers.EIGHT && { eight: true }),
                ...(award === awardNumbers.SEVEN && { seven: true }),
                ...(award === awardNumbers.SIX && { six: true }),
                ...(award === awardNumbers.FIVE && { five: true }),
                ...(award === awardNumbers.FOUR && { four: true }),
                ...(award === awardNumbers.THREE && { three: true }),
                ...(award === awardNumbers.TWO && { two: true }),
                ...(award === awardNumbers.ONE && { one: true }),
                ...(award === awardNumbers.SPECIAL && { special: true }),
            }
        });

        return { items, total };
    };

    const dataProcessing = async (award: awardNumbers, locationCode: LocationCode, typeProcess: TypeProcess) => {
        const pickValues = (item: DayTicketPeriod, award: awardNumbers) => {
            switch (award) {
                case awardNumbers.EIGHT:
                    return item.eight;
                case awardNumbers.SEVEN:
                    return item.seven;
                case awardNumbers.SIX:
                    return item.six;
                case awardNumbers.FIVE:
                    return item.five;
                case awardNumbers.FOUR:
                    return item.four;
                case awardNumbers.THREE:
                    return item.three;
                case awardNumbers.TWO:
                    return item.two;
                case awardNumbers.ONE:
                    return item.one;
                default:
                    return item.special;
            }
        };
        try {
            // get source data
            const { items, total } = await crawDBData({
                locationCode,
                award
            });
            for (const item of items) {
                // pitching date 02/01/2008
                const date = item.date;
                const [day, month, year] = date.split('/');

                // priceValuePicking

            }

        } catch (error) {
            console.log("🚀 ~ dataProcessing ~ error:", error);
        }
    };
};

dataProcessing();