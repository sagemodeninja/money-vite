import { FILE_FORMAT } from "../constants/file-format";

const TYPES_ARRAY = [
    {
        description: FILE_FORMAT.DESCRIPTION,
        accept: {
            [FILE_FORMAT.MIME_TYPE]: [FILE_FORMAT.EXTENSION],
        },
    },
];

export const saveFileHandle = async (filename?: string): Promise<FileSystemFileHandle> => {
    const suggestedName = `${filename ?? 'Untitled'}${FILE_FORMAT.EXTENSION}`;

    return await window.showSaveFilePicker({
        suggestedName,
        types: TYPES_ARRAY
    });
}
