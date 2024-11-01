// Source data structure
export interface DayTicketPeriod {
    date: string;
    special: string;
    one: string;
    two: string,
    three: string,
    four: string,
    five: string;
    six: string,
    seven: string,
    eight: string;
}

export type YearTicketPeriod = DayTicketPeriod[];

export const originSourceNb = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// file structure
export enum DaysName {
    Mon = "Mon",
    Tue = "Tue",
    Wed = "Wed",
    Thu = "Thu",
    Fri = "Fri",
    Sat = "Sat",
    Sun = "Sun",
}

export enum MonthsName {
    Jan = "Jan",
    Feb = "Feb",
    Mar = "Mar",
    Apr = "Apr",
    May = "May",
    Jun = "Jun",
    Jul = "Jul",
    Aug = "Aug",
    Sep = "Sep",
    Oct = "Oct",
    Nov = "Nov",
    Dec = "Dec",
}

export enum MonthsIndex {
    Jan = "1",
    Feb = "2",
    Mar = "3",
    Apr = "4",
    May = "5",
    Jun = "6",
    Jul = "7",
    Aug = "8",
    Sep = "9",
    Oct = "10",
    Nov = "11",
    Dec = "12",
}

export interface SimplePercentItem {
    number: number,
    total: number,
    percent: number;
}
export type SimplePercent = SimplePercentItem[];

export interface DayPercentItem {
    day: DaysName,
    numbers: SimplePercentItem[];
}
export type DayPercent = DayPercentItem[];

export interface MonthPercentItem {
    month: MonthsName,
    numbers: SimplePercent;
}
export type MonthPercent = MonthPercentItem[];

export interface YearPercentItem {
    year: number;
    numbers: SimplePercent;
}
export type YearPercent = YearPercentItem[];

// function process

export interface generateAllDateInYear {
    year: number,
    day: DaysName;
}

export interface generatePercent {
    sourceFilePath: string,
    outputFilePath: string;
}

export interface generateDatePercent {
    sourceFilePath: string[];
    outputFilePath: string;
    days: DaysName[];
}

export interface generateMonthPercent {
    sourceFilePath: string[];
    outputFilePath: string;
}

export interface generateYearPercent {
    sourceFilePath: string[];
    outputFilePath: string;
}
