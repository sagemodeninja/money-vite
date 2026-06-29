import type { Project } from "@/entities/project";
import { KwartaWriter } from "../file/writer";
import type { Account } from "@/entities/account";
import type { Page } from "@/entities/directory";

export class ProjectWriter {
    constructor(_: number) { }

    public async write(project: Project, handle: FileSystemFileHandle): Promise<void> {
        const writable = await handle.createWritable({
            keepExistingData: true
        });

        await this.writeHeader(project, writable);
        await this.writeDirectories(project, writable);
        await this.writeAccounts(project, writable);

        await writable.close();
    }

    private async writeHeader(project: Project, stream: FileSystemWritableFileStream): Promise<void> {
        const writer = new KwartaWriter(4 + 2 + project.title.length);

        writer.setString("KWRT");
        writer.setVarString(project.title);

        const bytes = writer.flush();
        await stream.write(bytes);
    }

    private async writeDirectories(project: Project, stream: FileSystemWritableFileStream): Promise<void> {
        const headerSize = 4 + 2 + 100; // Assuming title is 100 chars max.
        const bufferSize = project.directory.length * 13;
        const startOffset = headerSize + bufferSize;

        const writer = new KwartaWriter(bufferSize);

        for (var directory of project.directory) {
            writer.setUint8(directory.type);
            writer.setUint32(startOffset); // I know this
            writer.setUint32(startOffset); // is a bug...
            writer.setUint32(4);
        }

        await stream.write({
            type: 'write',
            position: headerSize,
            data: writer.flush()
        });
    }

    private async writeAccounts(project: Project, stream: FileSystemWritableFileStream) {
        const headerSize = 4 + 2 + 100; // Assuming title is 100 chars max.
        const bufferSize = project.directory.length * 13;
        const startOffset = headerSize + bufferSize;

        const page = await this.createAccountPage(project.accounts);

        const writer = new KwartaWriter(16 + page.dataSize);

        writer.setUint32(page.prevPageOffset);
        writer.setUint32(page.nextPageOffset);
        writer.setUint32(project.accounts.length);
        writer.setUint32(page.dataSize);
        writer.append(page.data);

        await stream.write({
            type: 'write',
            position: startOffset,
            data: writer.flush()
        });
    }

    private async createAccountPage(accounts: Array<Account>): Promise<Page> {
        const dataSize = accounts.reduce((len, act) => {
            return len + 1 + 2 + act.name.length;
        }, 0);

        const writer = new KwartaWriter(dataSize);

        for (var account of accounts) {
            writer.setString(account.id);
            writer.setVarString(account.name);
        }

        return {
            prevPageOffset: 0,
            nextPageOffset: 0,
            recordCount: accounts.length,
            dataSize,
            data: writer.flush()
        };
    }
}
