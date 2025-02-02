import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { LZPatch, LZPatchHeaders, ScanRp, TransformingData, unusedHeaders, UnusedItem, unusedTails } from './patchGenerate.interface';
import { format, parse } from 'date-fns';

const csv2arr = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const results: any[] = [];

        fs.createReadStream(filePath)
            .pipe(
                csvParser({ mapHeaders: ({ header }) => header.replace(/\s+/g, '').toLowerCase() }),
            )
            .on('data', (data: any) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error: any) => reject(error));
    });
};

const mappingPatchToCSV = (patchContent: LZPatch[]): string[] => {
    return patchContent.map((line) => {
        const {
            FromLocationCode,
            FromLocationName,
            ItemID,
            ItemNo,
            Status,
            ToLocationCode,
            ToLocationName,
            status_date,
            CustAccNum,
            ReasonCode,
            status_code_id
        } = line;

        return `${ItemID},${ItemNo},${Status},${ReasonCode},${status_code_id},${status_date},${FromLocationCode},${FromLocationName},${ToLocationCode},${ToLocationName},${CustAccNum},`;
    });
};

const csvSaving = async ({ details, fileName }: {
    details: LZPatch[],
    fileName: string;
}) => {
    const csvContent = [
        LZPatchHeaders,
        ...mappingPatchToCSV(details)
    ].join('\n');

    await fs.writeFileSync(fileName, csvContent, 'utf-8');
    console.log(`CSV file was success save in ${fileName}`);
};

const GenerateLZPatch = async () => {
    const transformingDataPath = 'C:/Sources/draftExpress/LZPatch/MappingData.csv';
    const scanRPPath = 'C:/Sources/draftExpress/LZPatch/scanRP/scanRP.csv';
    const outputLZPatchPath = 'C:/Sources/draftExpress/LZPatch/output/LZPatch.csv';

    const transformingData: TransformingData[] = await csv2arr(transformingDataPath);
    const scanRPData: ScanRp[] = await csv2arr(scanRPPath);

    // remove unused items
    const filedScanRP = scanRPData.filter((item) => {
        const startChar = item.trackingnumber.slice(0, 2);
        const endChar = item.trackingnumber.slice(-2);

        return startChar === 'S2' ? !unusedHeaders.includes(startChar) : !unusedHeaders.includes(startChar) && !unusedTails.includes(endChar);
    });

    const uniqueStatus = [... new Set(filedScanRP.map((item) => item.statusname))];
    const mappingData = transformingData.filter((item) => uniqueStatus.includes(item.internalstatusname));

    const mappedPatch: LZPatch[] = [];
    const errMappingItems: ScanRp[] = [];

    filedScanRP.forEach((item) => {
        try {
            const {
                fromlocationcode,
                fromlocationname,
                reasoncode,
                scandatetime,
                statusname,
                tolocationcode,
                tolocationname,
                trackingnumber,
            } = item;
            // data processing
            const mappingItem = mappingData.filter((element) => {
                const {
                    internalreasoncode,
                    internalstatusname
                } = element;
                if (reasoncode) {
                    return statusname === internalstatusname && reasoncode === internalreasoncode;
                } else {
                    return statusname === internalstatusname;
                }
            });
            const mapStatus = mappingItem[0].outstatuscode;
            const mapReason = mappingItem[0].outreasoncode === '*' ? '' : mappingItem[0].outreasoncode;
            const originDate = parse(scandatetime, 'dd/MM/yyyy HH:mm:ss', new Date());
            const formatedDate = format(originDate, 'M/d/yy HH:mm:ss');

            mappedPatch.push({
                ItemID: 1,
                ItemNo: trackingnumber,
                Status: mapStatus,
                ReasonCode: mapReason,
                status_code_id: '',
                status_date: `${formatedDate}`,
                FromLocationCode: fromlocationcode,
                FromLocationName: fromlocationname,
                ToLocationCode: tolocationcode,
                ToLocationName: tolocationname,
                CustAccNum: ''
            });
        } catch (error) {
            console.log("🚀 ~ filedScanRP.forEach ~ error:", error);
            console.log('???????????//', item);
            errMappingItems.push(item);
        }

    });

    console.log('>>>>>>>>>>>>>>>>', errMappingItems);
    mappedPatch.forEach((item, index) => item.ItemID = index + 1);
    await csvSaving({ details: mappedPatch, fileName: outputLZPatchPath });
};

GenerateLZPatch();