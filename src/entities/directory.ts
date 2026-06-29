export interface Directory { // 13 bytes
    type: number;            //  1 byte
    firstPageOffset: number; //  4 bytes
    lastPageOffset: number;  //  4 bytes
    recordCount: number;     //  4 bytes
}

export interface Page {      // 16 bytes + var
    prevPageOffset: number;  //  4 bytes
    nextPageOffset: number;  //  4 bytes
    recordCount: number;     //  4 bytes
    dataSize: number;        //  4 bytes
    data: Uint8Array;        // variable
}
