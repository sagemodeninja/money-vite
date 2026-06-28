import type { Account } from "./entities/account";
import { createFileHandle, openFileHandle } from "./utils/file";
import "./style.css";
import type { Project } from "./entities/project";

const accounts = Array<Account>();

const openFileBtn = document.querySelector("#open-file-btn");
const saveFileBtn = document.querySelector("#save-file-btn");
const addBtn = document.querySelector("#add-btn");
const accountList = document.querySelector("#account-list");

const openProject = async () => {
    const handle = await openFileHandle();

    const file = await handle.getFile();

    const chunk = file.slice(0, file.size);
    const buffer = await chunk.arrayBuffer();
    const view = new DataView(buffer);

    const length = view.getUint16(4, true);

    const decoder = new TextDecoder();
    const magic = decoder.decode(new Uint8Array(buffer, 0, 4));
    const title = decoder.decode(new Uint8Array(buffer, 6, length));

    var cursor = 6 + length;

    do {
        const id = decoder.decode(new Uint8Array([view.getUint8(cursor)]));
        const len = view.getUint16(cursor + 1, true);
        const name = decoder.decode(new Uint8Array(buffer, cursor + 1 + 2, len));

        accounts.push({ id, name });
        cursor += 1 + 2 + len;
    } while (cursor < buffer.byteLength);

    refresh();

    console.log(magic, title);
}

const saveProject = async (project: Project) => {
    const handle = await createFileHandle();

    const encoder = new TextEncoder();
    const writable = await handle.createWritable();

    const accountBytes = project.accounts.reduce((acc, act) => {
        const [id] = encoder.encode(act.id);
        const name = encoder.encode(act.name);

        const buffer = new ArrayBuffer(1 + 2 + name.length);
        const view = new DataView(buffer);

        view.setUint8(0, id);
        view.setUint16(1, name.length, true);

        const bytes = new Uint8Array(buffer);
        bytes.set(name, 3);

        acc.push(...bytes);
        return acc;
    }, Array<number>());

    const title = encoder.encode(project.header.title);

    const buffer = new ArrayBuffer(4 + 2 + title.length + accountBytes.length);
    const view = new DataView(buffer);

    view.setUint16(4, title.length, true);

    const bytes = new Uint8Array(buffer);

    bytes.set([75, 87, 82, 84], 0);
    bytes.set(title, 6);
    bytes.set(accountBytes, 6 + title.length);

    await writable.write(bytes);

    await writable.close();
}

openFileBtn?.addEventListener('click', openProject);

saveFileBtn?.addEventListener('click', async () => {
    await saveProject({
        header: {
            magic: 'KWRT',
            title: 'My Kwarta'
        },
        accounts
    });
});

const refresh = () => {
    if (!accountList) return;

    accountList.innerHTML = "";

    for (const account of accounts) {
        const item = document.createElement("li");
        item.addEventListener("click", () => {
            alert(`Show ${account.id}`);
        });
        item.innerText = account.name;
        accountList.appendChild(item);
    }
}

addBtn?.addEventListener("click", () => {
    const name = prompt("Enter account name");

    if (!name) return;

    accounts.push({
        id: accounts.length.toString(),
        name
    });

    refresh();
});
