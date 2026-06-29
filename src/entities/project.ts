import type { Account } from "./account";

export interface Project {
    title: string;
    accounts: Array<Account>;
}
