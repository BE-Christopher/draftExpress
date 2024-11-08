// Source data structure
export interface DayTicketPeriod {
    date: string;
    special: string;
    one: string;
    two: string,
    three: string | string[],
    four: string | string[],
    five: string;
    six: string | string[],
    seven: string,
    eight: string;
}

export const ticketPrizeName: (keyof DayTicketPeriod)[] = [
    "eight",
    "seven",
    "six",
    "five",
    "four",
    "three",
    "two",
    "one",
    "special"
];

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

// for CT ticket
export const yearCawing = [
    2008,
    2009,
    2010,
    2011,
    2012,
    2013,
    2014,
    2015,
    2016,
    2017,
    2018,
    2019,
    2020,
    2021,
    2022,
    2023,
    2024
];

export enum LocationCode {
    CT = 'CT'
}
export enum awardNumbers {
    EIGHT = "eight",
    SEVEN = "seven",
    SIX = "six",
    FIVE = "five",
    FOUR = "four",
    THREE = "three",
    TWO = "two",
    ONE = "one",
    SPECIAL = "special"
}

export enum calculateBy {
    totalDate = 'TotalDate',
    totalAware = 'TotalAware'
}

export enum TypeProcess {
    FirstCrawler = 'FirstCrawler',
    UpdateAfterCraw = 'UpdateAfterCraw'
}

export enum Units {
    Unit = 'Unit',
    Ten = 'Ten',
    Hundred = 'Hundred',
    Thousand = 'Thousand',
    TenThousand = 'TenThousand',
    HundredThousand = 'HundredThousand'
}