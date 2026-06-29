export class KwartaWriter {
    private _buffer: ArrayBuffer;
    private _textEncoder: TextEncoder;

    private _cursor: number = 0;

    constructor(size: number) {
        this._buffer = new ArrayBuffer(size);
        this._textEncoder = new TextEncoder();
    }

    public seek(position: number): void {
        this._cursor = position;
    }

    public async setUint16(value: number, littleEndian: boolean = false): Promise<void> {
        const view = new DataView(this._buffer);
        view.setUint16(this._cursor, value, littleEndian);
        this._cursor += 2;
    }

    public async setString(value: string, length: number): Promise<void> {
        const buffer = new Uint8Array(this._buffer);
        const bytes = this._textEncoder.encode(value);

        buffer.set(bytes, this._cursor);
        this._cursor += length;
    }

    public async setVarString(value: string): Promise<void> {
        await this.setUint16(value.length, true);
        await this.setString(value, value.length);
    }

    public flush(): Uint8Array<ArrayBuffer> {
        return new Uint8Array(this._buffer);
    }
}
