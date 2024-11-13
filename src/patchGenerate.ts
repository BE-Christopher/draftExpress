import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { Parser } from 'json2csv';


const sourceFolder = 'C:/Sources/draftExpress/dist/SourceFiles';
const outFolder = 'C:/Sources/draftExpress/dist/OutFiles';
const exportMappingFilePath = 'C:/Sources/draftExpress/dist/Export_status_mapping_160824.csv';

const pickingStatus = [
    'HYPASHIP',
    'HYPASHIP/0099999A'
];

interface SourceData {
    trackingnumber: string,
    ediname: string,
    statusname: string,
    statusdescription: string,
    reasoncode: string,
    reasondescription: string,
    scandatetime: string,
    fromlocationcode: string,
    fromlocationname: string,
    tolocationcode: string,
    tolocationname: string,
    creationdatetime: string;
}

interface ExportMapping {
    ediname: string,
    edidescription: string,
    service: string,
    customer: string,
    ordering: string,
    internalstatusname: string,
    internalreasoncode: string,
    outstatuscode: string,
    outreasoncode: string,
    trackandtracedescription: string,
    eventcode: string,
    detailtemplate: string,
    associateddataname: string,
    associateddatatexttemplate: string,
    eventtransactionID: string,
    successorfailure: string,
    eventdescription: string,
    nondeliveryreason: string,
    nondeliverymeasure: string,
}

interface LZPatch {
    ItemID: string,
    ItemNo: string,
    Status: string,
    ReasonCode: string,
    status_code_id: string,
    status_date: string,
    FromLocationCode: string,
    FromLocationName: string,
    ToLocationCode: string,
    ToLocationName: string,
    CustAccNum: string,
}

const PatchKeys = [
    'ItemID',
    'ItemNo',
    'Status',
    'ReasonCode',
    'status_code_id',
    'status_date',
    'FromLocationCode',
    'FromLocationName',
    'ToLocationCode',
    'ToLocationName',
    'CustAccNum',
];

const internalStatusName = [
    'DA0', 'DBF', 'DBT', 'DBH', 'DBH',
    'DBR', 'DBX', 'DBS', 'DWI', 'DYC',
    'DYB', 'DYO', 'DYI', 'RBN', 'DYZ',
    'DBC', 'DBC', 'DZI', 'DZX', 'DZO',
    'DZC', 'DA1', 'DA2', 'DA3', 'DA4',
    'DBT', 'DBH', 'DB0', 'DB0', 'DB0',
    'DB0', 'DB1', 'DBH', 'DBH', 'DB0',
    'DWB', 'RWB', 'DBJ', 'DWL', 'DBS',
    'RWI'
];

const internalReasonCode = [
    'DBT01', 'DBH03', 'DBH02',
    'DBR01', 'DBS01', 'DBC08',
    'DBC09', 'DBT02', 'DBH01',
    'DB001', 'DB002', 'DB003',
    'DB005', 'DB101', 'DBH04',
    'DBH05', 'DB004', 'DBS03'
];

const filterStartLineChars = [
    'PP',
    'RA',
    'TP',
    'SM',
    'S2',
];

const listFiles = (folderPath: string) => {
    return fs.readdirSync(folderPath);
};

const csv2Arr = (path: string) => {
    return new Promise((resolve, reject) => {
        const results: any[] = [];

        fs.createReadStream(path)
            .pipe(
                csvParser({ mapHeaders: ({ header }) => header.replace(/\s+/g, '').toLowerCase() })
            )
            .on('data', (data: any) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error: any) => reject(error));
    });
};

const filterArray = (item: SourceData, status: string[], reason: string[]) => {
    if (!pickingStatus.includes(item.ediname)) return false;
    if (filterStartLineChars.includes((item.trackingnumber as string).slice(0, 2))) return false;
    if (!status.includes(item.statusname)) return false;
    if (item.reasoncode && !reason.includes(item.reasoncode)) return false;

    return true;
};

const generatePatch = (data: SourceData, mapper: ExportMapping[], id: string) => {
    // pick mapper status
    const checkMap = mapper.filter(line => line.internalstatusname === data.statusname);
    if (!checkMap.length) return -1;

    // pick reason
    const reasonIdx = checkMap.findIndex(line => line.internalreasoncode === data.reasoncode);
    const {
        outreasoncode,
        outstatuscode
    } = checkMap[reasonIdx != -1 ? reasonIdx : 0];

    // date processing
    const [date, time] = data.scandatetime.split(' ');
    const [day, month, year] = date.split('/');
    const [hours, minutes] = time.split(':');
    const processedDate = `${month}/${day}/${year.slice(-2)} ${hours}:${minutes}`;

    const line: LZPatch = {
        ItemID: id,
        ItemNo: data.trackingnumber,
        Status: outstatuscode,
        ReasonCode: outreasoncode !== '*' ? outreasoncode : '',
        status_code_id: '',
        status_date: processedDate,
        FromLocationCode: data.fromlocationcode,
        FromLocationName: data.fromlocationname,
        ToLocationCode: data.tolocationcode,
        ToLocationName: data.tolocationname,
        CustAccNum: ''
    };

    return line;
};

const saveFiles = (data: LZPatch[], fileName: string) => {
    const json2CsvParser = new Parser({ fields: PatchKeys });
    const csv = json2CsvParser.parse(data);

    fs.writeFile(`${fileName}.csv`, csv, (err) => {
        if (err) {
            console.error('Error writing CSV file', err);
            return;
        }
        console.log('CSV file has been saved.');
    });
};

const automatedGeneratePathFiles = async (sourceFolder: string, outFolder: string) => {
    // read all csv files
    const sourceFilePaths: string[] = await listFiles(sourceFolder);
    const exportMappingData: ExportMapping[] = (await csv2Arr(exportMappingFilePath) as unknown as ExportMapping[]).filter(item => item.ediname === '0099999A');

    // one by one process
    for (const file of sourceFilePaths) {
        // read file
        const path = `${sourceFolder}/${file}`;
        const data: SourceData[] = (await csv2Arr(path) as unknown as SourceData[]).filter(item => filterArray(item, internalStatusName, internalReasonCode));
        const results: LZPatch[] = [];

        data.forEach((item, index) => {
            const line = generatePatch(item, exportMappingData, `${index}`);
            typeof line === 'number' ? null : results.push(line);
        });

        // save files
        saveFiles(results, `${outFolder}/LZPatch`);

        console.log('>>>>>>>>>>>>>>>>>>Generated files<<<<<<<<<<<<<<<<<<');
    }
};

automatedGeneratePathFiles(sourceFolder, outFolder);