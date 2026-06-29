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

    public setUint8(value: number): void {
        const view = new DataView(this._buffer);
        view.setUint8(this._cursor, value);
        this._cursor += 1;
    }

    public setUint16(value: number, littleEndian: boolean = false): void {
        const view = new DataView(this._buffer);
        view.setUint16(this._cursor, value, littleEndian);
        this._cursor += 2;
    }

    public setUint32(value: number, littleEndian: boolean = false): void {
        const view = new DataView(this._buffer);
        view.setUint32(this._cursor, value, littleEndian);
        this._cursor += 4;
    }

    public setString(value: string): void {
        const buffer = new Uint8Array(this._buffer);
        const bytes = this._textEncoder.encode(value);

        buffer.set(bytes, this._cursor);
        this._cursor += value.length;
    }

    public setVarString(value: string): void {
        this.setUint16(value.length, true);
        this.setString(value);
    }

    public append(bytes: Uint8Array) {
        const buffer = new Uint8Array(this._buffer);
        buffer.set(bytes, this._cursor);
        this._cursor += bytes.length;
    }

    public flush(): Uint8Array<ArrayBuffer> {
        return new Uint8Array(this._buffer);
    }
}
