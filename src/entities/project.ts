import type { Account } from "./account";

export interface Project {
    header: ProjectHeader;
    // directory: ProjectDirectory;
    accounts: Array<Account>;
}

export interface ProjectHeader {
    magic: string;
    title: string;
}

export interface ProjectDirectory {
    accountsOffset: number;
}
