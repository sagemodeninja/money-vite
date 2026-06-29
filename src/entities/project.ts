import type { Account } from "./account";
import type { Directory } from "./directory";

export interface Project {
    title: string;
    directory: Array<Directory>;
    accounts: Array<Account>;
}
