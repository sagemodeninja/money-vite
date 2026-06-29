import type { Project } from "@/entities/project";
import { FileHandle } from "../file";
import { ProjectReader } from "./reader";
import { saveFileHandle } from "../file_legacy";
import { ProjectWriter } from "./writer";

export class ProjectHandle {
    private readonly _file: FileHandle;
    private readonly _reader: ProjectReader;

    private _project?: Project;

    public get project(): Project {
        return this._project!;
    }

    constructor() {
        this._file = new FileHandle();
        this._reader = new ProjectReader(this._file);
    }

    public async open(): Promise<ProjectHandle> {
        await this._file.open();

        const title = await this._reader.getTitle();
        const accounts = await this._reader.getAccounts();

        this._project = { title, accounts };
        return this;
    }

    public async save(): Promise<void> {
        const project = this._project;

        if (!project)
            throw new Error('Project is not available!');

        const accountLength = project.accounts.reduce((len, act) => {
            return len + 1 + 2 + act.name.length;
        }, 0);

        const handle = await saveFileHandle();
        const writer = new ProjectWriter(4 + 2 + project.title.length + 2 + accountLength);

        await writer.write(project, handle)
    }
}
