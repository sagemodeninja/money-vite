import type { Account } from "./entities/account";
import "./style.css";

const accounts = Array<Account>();

const openFileBtn = document.querySelector("#open-file-btn");
const addBtn = document.querySelector("#add-btn");
const accountList = document.querySelector("#account-list");

const openProject = async () => {
    const [handle] = await window.showOpenFilePicker({
        multiple: false,
    });

    const file = await handle.getFile();

    // const start = 1024;
    // const end = 2048;

    const chunk = file.slice(0, file.size);
    const buffer = await chunk.arrayBuffer();

    const text = new TextDecoder().decode(buffer);
    console.log(text);
}

const saveProject = async () => {
    const handle = await window.showSaveFilePicker({
        suggestedName: 'hello.txt',
        types: [
            {
                description: 'Text Files',
                accept: {
                    'text/plain': ['.txt'],
                },
            },
        ],
    });

    const writable = await handle.createWritable();

    const bytes = new Uint8Array([
        0x48, 0x65, 0x6C, 0x6C, 0x6F // "Hello"
    ]);

    await writable.write(bytes);

    await writable.close();
}

openFileBtn?.addEventListener("click", saveProject);

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
