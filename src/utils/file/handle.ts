import { FILE_FORMAT } from "../../constants/file-format";

const TYPES_ARRAY = [
    {
        description: FILE_FORMAT.DESCRIPTION,
        accept: {
            [FILE_FORMAT.MIME_TYPE]: [FILE_FORMAT.EXTENSION],
        },
    },
];

export class FileHandle {
    private _file?: File;

    public async open(): Promise<void> {
        const [handle] = await window.showOpenFilePicker({
            multiple: false,
            types: TYPES_ARRAY
        });

        this._file = await handle.getFile();
    }

    public async save(): Promise<void> { }

    public async read(offset: number, length: number): Promise<ArrayBuffer> {
        if (!this._file)
            throw new Error('File not available!');

        const chunk = this._file.slice(offset, offset + length);
        return await chunk.arrayBuffer();
    }
}
