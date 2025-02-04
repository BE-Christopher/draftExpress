import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { LZPatch, LZPatchHeaders, ScanRp, TransformingData, unusedHeaders, UnusedItem, unusedTails } from './patchGenerate.interface';
import * as xlsx from 'xlsx';

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

// const excel2arr = (filePath: string): Promise<any[]> => {
//     return new Promise((resolve, reject) => {
//         try {
//             const workbook = xlsx.readFile(filePath);
//             const sheetName = workbook.SheetNames[0];
//             const worksheet = workbook.Sheets[sheetName];

//             const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

//             if (data.length < 2) return resolve([]);

//             const headers = data[0].map((h) => h?.toString().trim().toLowerCase().replace(/\s+/g, '') || '');

//             const results = data.slice(1).map((row) => {
//                 return Object.fromEntries(
//                     headers.map((header, i) => {
//                         let value = row[i];

//                         if (typeof value === 'number' && header.includes('date')) {
//                             const parsedDate = xlsx.SSF.parse_date_code(value);

//                             const pad = (num: number) => num.toString().padStart(2, '0');

//                             value = `${parsedDate.m}/${parsedDate.d}/${parsedDate.y.toString().slice(-2)} ${pad(parsedDate.H)}:${pad(parsedDate.M)}:${pad(parsedDate.S)}`;
//                         }

//                         return [header, value || ''];
//                     })
//                 );
//             });

//             resolve(results);
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

const excel2arr = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

            if (data.length < 2) return resolve([]);

            const headers = data[0].map((h) => h?.toString().trim().toLowerCase().replace(/\s+/g, '') || '');

            const results = data.slice(1).map((row) => {
                const result = Object.fromEntries(
                    headers.map((header, i) => {
                        let value = row[i];

                        if (typeof value === 'number' && header.includes('date')) {
                            const parsedDate = xlsx.SSF.parse_date_code(value);

                            const pad = (num: number) => num.toString().padStart(2, '0');

                            value = `${parsedDate.m}/${parsedDate.d}/${parsedDate.y.toString().slice(-2)} ${pad(parsedDate.H)}:${pad(parsedDate.M)}:${pad(parsedDate.S)}`;
                        }

                        return [header, value || ''];
                    })
                );

                if (result.trackingnumber && !filterTrackingNumbers(result.trackingnumber)) {
                    return null;
                }

                return result;
            }).filter((item) => item !== null);

            resolve(results);
        } catch (error) {
            reject(error);
        }
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

const excelSaving = async ({ details, fileName }: { details: LZPatch[]; fileName: string; }) => {
    try {
        if (!details || details.length === 0) {
            console.error("❌ Dữ liệu trống, không thể ghi file Excel.");
            return;
        }

        const headers = LZPatchHeaders.replace(/"/g, "").replace(/,$/, "").split(",");

        // ✨ Chuyển đổi dữ liệu thành array object
        const data = mappingPatchToCSV(details).map((row) => {
            const values = row.split(",");
            return Object.fromEntries(headers.map((header, i) => [header, values[i] || ""]));
        });

        const worksheet = xlsx.utils.json_to_sheet(data);

        // ✨ Tạo workbook & ghi vào sheet
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // ✨ Ghi file Excel
        xlsx.writeFile(workbook, fileName);

        console.log(`✅ Excel file was successfully saved: ${fileName}`);
    } catch (error) {
        console.error("❌ Error saving Excel file:", error);
    }
};

const filterTrackingNumbers = (trackingNumber: string): boolean => {
    if (!trackingNumber) return false;

    // Mẫu regex loại bỏ:
    const patternsToRemove = [
        /^PP\d+SG$/,
        /^RA\d+SG$/,
        /^TP\d+SG$/,
        /^SM\d+SG$/,
        /^S2\d+$/
    ];

    // Kiểm tra nếu khớp với bất kỳ pattern nào thì loại bỏ
    for (const pattern of patternsToRemove) {
        if (pattern.test(trackingNumber)) {
            return false;
        }
    }

    return true; // Giữ lại nếu không khớp bất kỳ pattern nào
};

const GenerateLZPatch = async () => {
    const transformingDataPath = 'C:/Sources/draftExpress/LZPatch/MappingData.csv';
    const scanRPPath = 'C:/Sources/draftExpress/LZPatch/scanRP/demo.xlsx';
    const outputLZPatchPath = 'C:/Sources/draftExpress/LZPatch/output/LZPatch01022025 - v02.xlsx';

    const transformingData: TransformingData[] = await csv2arr(transformingDataPath);
    const filedScanRP: ScanRp[] = await excel2arr(scanRPPath);
    console.log("🚀 ~ GenerateLZPatch ~ filedScanRP:", filedScanRP);

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

            mappedPatch.push({
                ItemID: 1,
                ItemNo: trackingnumber,
                Status: mapStatus,
                ReasonCode: mapReason,
                status_code_id: '',
                status_date: `${scandatetime}`,
                FromLocationCode: fromlocationcode,
                FromLocationName: fromlocationname,
                ToLocationCode: tolocationcode,
                ToLocationName: tolocationname,
                CustAccNum: ''
            });
        } catch (error) {
            console.log("🚀 ~ filedScanRP.forEach ~ error:", error);
            errMappingItems.push(item);
        }

    });

    console.log('>>>>>>>>>>>>>>>>', errMappingItems);
    mappedPatch.forEach((item, index) => item.ItemID = index + 1);
    await excelSaving({ details: mappedPatch, fileName: outputLZPatchPath });
};

GenerateLZPatch();