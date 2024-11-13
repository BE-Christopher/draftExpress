import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { Parser } from 'json2csv';


const sourceFolder = 'dist/SourceFiles';
const outFolder = 'dist/OutFiles';
const exportMappingFilePath = '"C:/Users/ADMIN/Downloads/Export_status_mapping_160824.csv"';

const pickingStatus = [
    'HYPASHIP',
    'HYPASHIP/0099999A'
];

interface SourceData {
    trackingnumer: string,
    ediname: string,
    statuscode: string,
    statusdescription: string,
    reasoncode: string,
    reasondescription: string,
    scandate: string,
    fromlocationcode: string,
    fromlocationname: string,
    tolocationcode: string,
    tolocationname: string,
    creationdatetime: string;
}

interface ExportMapping {
    EDIname: string,
    EDIdescription: string,
    Service: string,
    Customer: string,
    Ordering: string,
    Internalstatusname: string,
    Internalreasoncode: string,
    Outstatuscode: string,
    Outreasoncode: string,
    Trackandtracedescription: string,
    Eventcode: string,
    Detailtemplate: string,
    Associateddataname: string,
    Associateddatatexttemplate: string,
    EventtransactionID: string,
    Successorfailure: string,
    Eventdescription: string,
    Nondeliveryreason: string,
    Nondeliverymeasure: string,

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


const listFiles = async (folderPath: string) => {
    const filesName: string[] = [];
    const files = await fs.readdir(folderPath, (err, files) => {
        files.forEach(file => filesName.push(file));
    });

    return filesName;
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

const generatePatch = (data: SourceData, mapper: ExportMapping[], id: string) => {
    // pick mapper status
    const checkMap = mapper.filter(line => line.Internalstatusname === data.statuscode);
    if (!checkMap.length) return -1;

    // pick reason
    const reasonIdx = checkMap.findIndex(line => line.Internalreasoncode === data.reasoncode);
    const {
        Outreasoncode,
        Outstatuscode
    } = checkMap[reasonIdx != -1 ? reasonIdx : 0];

    // date processing
    const [date, time] = data.scandate.split(' ');
    const [day, month, year] = date.split('/');
    const processedDate = `${month}/${day}/${year} ${time}`;

    const line: LZPatch = {
        ItemID: id,
        ItemNo: data.trackingnumer,
        Status: Outstatuscode,
        ReasonCode: Outreasoncode,
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
    const exportMappingData: ExportMapping[] = await csv2Arr(exportMappingFilePath) as unknown as ExportMapping[];

    // one by one process
    for (const file of sourceFilePaths) {
        // read file
        const path = `${sourceFolder}/${file}`;
        const draftData: SourceData[] = await csv2Arr(path) as unknown as SourceData[];
        const data = draftData.filter((line) => pickingStatus.includes(line.ediname));
        const results: LZPatch[] = [];

        data.forEach((item, index) => {
            const line = generatePatch(item, exportMappingData, `${index}`);
            typeof line === 'number' ? null : results.push(line);
        });

        // save files
        saveFiles(results, 'demo');
    }
};

automatedGeneratePathFiles(sourceFolder, outFolder);