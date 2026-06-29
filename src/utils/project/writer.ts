import type { Project } from "@/entities/project";
import { KwartaWriter } from "../file/writer";

export class ProjectWriter {
    private readonly _writer: KwartaWriter;

    constructor(size: number) {
        this._writer = new KwartaWriter(size);
    }

    public async write(project: Project, handle: FileSystemFileHandle): Promise<void> {
        const writable = await handle.createWritable();
        const writer = this._writer;

        await writer.setString("KWRT", 4);
        await writer.setVarString(project.title);

        // Accounts
        await writer.setUint16(project.accounts.length, true);

        for (let account of project.accounts) {
            await writer.setString(account.id, 1);
            await writer.setVarString(account.name);
        }

        const bytes = writer.flush();

        await writable.write(bytes);
        await writable.close();
    }
}
