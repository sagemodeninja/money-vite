import type { Account } from "@/entities/account";
import { KwartaReader, type FileHandle } from "../file";
import type { Directory, Page } from "@/entities/directory";
import { RecordType } from "../../constants/record-type";

export class ProjectReader {
    private readonly _reader: KwartaReader;

    private _directories: Array<Directory> = [];

    constructor(file: FileHandle) {
        this._reader = new KwartaReader(file);
    }

    public async open(): Promise<void> {
        const magic = await this._reader.getString(4);

        if (magic !== 'KWRT')
            return alert('Invalid project file.')

        await this.cacheDirectory();
    }

    private async cacheDirectory() {
        const reader = this._reader;

        reader.seek(4 + 2 + 100);

        const type = await reader.getUint8();
        const firstPageOffset = await reader.getUint32();
        const lastPageOffset = await reader.getUint32();
        const recordCount = await reader.getUint32();

        this._directories = [
            { type, firstPageOffset, lastPageOffset, recordCount }
        ];
    }

    public async getTitle(): Promise<string> {
        this._reader.seek(4);
        return await this._reader.getVarString();
    }

    public async getAccounts(): Promise<Array<Account>> {
        const directory = this._directories.find(d => d.type == RecordType.accounts);

        if (!directory) return [];

        const page = await this.readPage(directory.firstPageOffset);

        const accounts = new Array<Account>();
        const reader = this._reader;

        for (let i = 0; i < page.recordCount; i++) {
            const id = await reader.getString(1);
            const name = await reader.getVarString();

            accounts.push({ id, name });
        }

        return accounts;
    }

    private async readPage(offset: number): Promise<Page> {
        const reader = this._reader;

        reader.seek(offset);

        const prevPageOffset = await reader.getUint32();
        const nextPageOffset = await reader.getUint32();
        const recordCount = await reader.getUint32();
        const dataSize = await reader.getUint32();
        const data = await reader.peek(dataSize);

        return {
            prevPageOffset,
            nextPageOffset,
            recordCount,
            dataSize,
            data
        };
    }
}
