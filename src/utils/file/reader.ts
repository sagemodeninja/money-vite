import type { FileHandle } from "./handle";

export class KwartaReader {
    private _handle: FileHandle;
    private _textDecoder: TextDecoder;

    private _cursor: number = 0;

    constructor(handle: FileHandle) {
        this._handle = handle;
        this._textDecoder = new TextDecoder();
    }

    public seek(position: number): void {
        this._cursor = position;
    }

    public async getUint8(): Promise<number> {
        const buffer = await this._handle.read(this._cursor, 1);
        const view = new DataView(buffer);

        const value = view.getUint8(0);
        this._cursor += 1;

        return value;
    }

    public async getUint16(littleEndian: boolean = false): Promise<number> {
        const buffer = await this._handle.read(this._cursor, 2);
        const view = new DataView(buffer);

        const value = view.getUint16(0, littleEndian);
        this._cursor += 2;

        return value;
    }

    public async getUint32(littleEndian: boolean = false): Promise<number> {
        const buffer = await this._handle.read(this._cursor, 4);
        const view = new DataView(buffer);

        const value = view.getUint32(0, littleEndian);
        this._cursor += 4;

        return value;
    }

    /** Gets a fixed-length (unpadded) string. */
    public async getString(length: number): Promise<string> {
        const buffer = await this._handle.read(this._cursor, length);
        const bytes = new Uint8Array(buffer);

        const value = this._textDecoder.decode(bytes);
        this._cursor += length;

        return value;
    }

    public async peek(length: number): Promise<Uint8Array> {
        const buffer = await this._handle.read(this._cursor, length);
        return new Uint8Array(buffer);
    }

    /** Gets a variable length (length-prefixed) string. */
    public async getVarString(): Promise<string> {
        const len = await this.getUint16(true);
        return await this.getString(len);
    }
}
