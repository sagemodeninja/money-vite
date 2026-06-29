import type { Account } from "@/entities/account";
import { KwartaReader, type FileHandle } from "../file";

export class ProjectReader {
    private readonly _reader: KwartaReader;

    constructor(file: FileHandle) {
        this._reader = new KwartaReader(file);
    }

    public async getTitle(): Promise<string> {
        this._reader.seek(4);
        return await this._reader.getVarString();
    }

    public async getAccounts(): Promise<Array<Account>> {
        const accounts = new Array<Account>();

        // TODO: Landmark known blocks or build directory or lenght-prefix blocks...
        // FIXME: Temporary cursor hack.
        await this.getTitle();

        const reader = this._reader;
        const count = await reader.getUint16(true);

        for (let i = 0; i < count; i++) {
            const id = await reader.getString(1);
            const name = await reader.getVarString();

            accounts.push({ id, name });
        }

        return accounts;
    }
}
