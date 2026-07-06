document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            const targetId = link.getAttribute("href");
            if (targetId && targetId.startsWith("#") && targetId !== "#") {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        });
    });
});

// ==========================================================================
// CRUD Section
// ==========================================================================

const entryForm = document.getElementById("dme-entry-form");
const entriesTableBody = document.getElementById("entries-table-body");
const saveBtn = document.getElementById("save-btn");
const clearBtn = document.getElementById("clear-btn");

let entries = JSON.parse(localStorage.getItem("dme_entries")) || [];
let editId = null;

renderEntries();

entryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("entry-name").value.trim();
    const email = document.getElementById("entry-email").value.trim();
    const phone = document.getElementById("entry-phone").value.trim();
    const note = document.getElementById("entry-note").value.trim();

    if (!name || !email || !phone) return;

    if (editId !== null) {
        entries = entries.map(entry =>
            entry.id === editId ? { id: entry.id, name, email, phone, note } : entry
        );
        editId = null;
        saveBtn.innerHTML = "Save Entry";
    } else {
        entries.push({ id: Date.now(), name, email, phone, note });
    }

    saveToStorage();
    renderEntries();
    entryForm.reset();
});

entriesTableBody.addEventListener("click", function (event) {
    const target = event.target.closest("button");
    if (!target) return;
    const id = parseInt(target.dataset.id);
    if (target.classList.contains("btn-edit")) {
        startEdit(id);
    } else if (target.classList.contains("btn-delete")) {
        deleteEntry(id);
    }
});

clearBtn.addEventListener("click", () => {
    entryForm.reset();
    editId = null;
    saveBtn.innerHTML = "Save Entry";
});

function saveToStorage() {
    localStorage.setItem("dme_entries", JSON.stringify(entries));
}

function renderEntries() {
    entriesTableBody.innerHTML = "";

    if (entries.length === 0) {
        entriesTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:20px;">No entries submitted yet</td></tr>`;
        return;
    }

    entries.forEach((entry, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><div class="index-badge">${index + 1}</div></td>
            <td class="font-semibold">${entry.name}</td>
            <td>${entry.email}</td>
            <td>${entry.phone}</td>
            <td class="note-text">${entry.note}</td>
            <td>
                <div class="action-buttons">
                    <button type="button" class="action-btn btn-edit" data-id="${entry.id}">Edit</button>
                    <button type="button" class="action-btn btn-delete" data-id="${entry.id}">Delete</button>
                </div>
            </td>
        `;
        entriesTableBody.appendChild(tr);
    });
}

function startEdit(id) {
    const entry = entries.find(item => item.id === id);
    if (!entry) return;

    document.getElementById("entry-name").value = entry.name;
    document.getElementById("entry-email").value = entry.email;
    document.getElementById("entry-phone").value = entry.phone;
    document.getElementById("entry-note").value = entry.note;

    editId = id;
    saveBtn.innerHTML = "Update Entry";
    entryForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteEntry(id) {
    if (confirm("Are you sure you want to delete this entry?")) {
        entries = entries.filter(item => item.id !== id);
        if (editId === id) {
            entryForm.reset();
            editId = null;
            saveBtn.innerHTML = "Save Entry";
        }
        saveToStorage();
        renderEntries();
    }
}