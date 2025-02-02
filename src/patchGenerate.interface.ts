export interface ScanRp {
    trackingnumber: string,
    ediname: string,
    statusname: string,
    reasoncode: string,
    scandatetime: string,
    fromlocationcode: string,
    fromlocationname: string,
    tolocationcode: string,
    tolocationname: string;
}

export interface LZPatch {
    ItemID: number,
    ItemNo: string,
    Status: string,
    ReasonCode?: string,
    status_code_id?: string,
    status_date: string,
    FromLocationCode: string,
    FromLocationName: string,
    ToLocationCode: string,
    ToLocationName: string,
    CustAccNum?: string;
}

export interface TransformingData {
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
    eventtransactionid: string,
    successorfailure: string,
    eventdescription: string,
    nondeliveryreason: string,
    nondeliverymeasure: string,
}

export interface UnusedItemFiler {
    start: string,
    end?: string;
}

    
export const LZPatchHeaders = `"ItemID","ItemNo","Status","ReasonCode","status_code_id","status_date","FromLocationCode","FromLocationName","ToLocationCode","ToLocationName","CustAccNum",`;

export const UnusedItem: UnusedItemFiler[] = [
    {
        start: 'PP',
        end: 'SG',
    },
    {
        start: 'RA',
        end: 'SG',
    },
    {
        start: 'TP',
        end: 'SG',
    },
    {
        start: 'SM',
        end: 'SG',
    },
    {
        start: 'S2',
        end: ''
    },
];
export const unusedHeaders = ['PP', 'RA', 'TP', 'SM', 'S2']
export const unusedTails = ['SG']


// ["trackingnumber", "ediname", "statusname", "reasoncode", "scandatetime", "fromlocationcode", "fromlocationname", "tolocationcode", "tolocationname"]
