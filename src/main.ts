import "./style.css";
import { ProjectHandle } from "./utils/project/handle";

const openFileBtn = document.querySelector("#open-file-btn");
const saveFileBtn = document.querySelector("#save-file-btn");
const addBtn = document.querySelector("#add-btn");
const accountList = document.querySelector("#account-list");

const project = new ProjectHandle();

const openProject = async () => {
    await project.open();
    refresh();
}

const saveProject = async () => {
    await project.save();
}

openFileBtn?.addEventListener('click', openProject);

saveFileBtn?.addEventListener('click', saveProject);

const refresh = () => {
    if (!accountList) return;

    accountList.innerHTML = "";

    for (const account of project.project.accounts) {
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

    project.project.accounts.push({
        id: project.project.accounts.length.toString(),
        name
    });

    refresh();
});
