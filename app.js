const fs = require("fs");
const readline = require("readline");

const FILE = "./notes.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function loadNotes() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
  }

  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch (error) {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Add Note
async function addNote() {
  const title = (await ask("Enter note title: ")).trim();
  const content = (await ask("Enter note content: ")).trim();

  if (!title || !content) {
    console.log("Title and content are required.\n");
    return;
  }

  const notes = loadNotes();

  const note = {
    id: Date.now(),
    title: title,
    content: content,
    createdAt: new Date().toISOString(),
  };

  notes.push(note);
  saveNotes(notes);

  console.log("Note added successfully.\n");
}

// View Notes
function viewNotes() {
  const notes = loadNotes();

  if (notes.length === 0) {
    console.log("No notes found.\n");
    return;
  }

  console.log("\n===== ALL NOTES =====");

  notes.forEach((note, index) => {
    console.log(`${index + 1}. ${note.title}`);
    console.log(`   ${note.content}`);
    console.log(`   ID: ${note.id}`);
    console.log("----------------------");
  });

  console.log();
}

// Update Note
async function updateNote() {
  const notes = loadNotes();

  if (notes.length === 0) {
    console.log("No notes available.\n");
    return;
  }

  viewNotes();

  const id = Number(
    (await ask("Enter note ID to update: ")).trim()
  );

  const note = notes.find((item) => item.id === id);

  if (!note) {
    console.log("Note not found.\n");
    return;
  }

  const newTitle = (
    await ask(`Enter new title (${note.title}): `)
  ).trim();

  const newContent = (
    await ask(`Enter new content (${note.content}): `)
  ).trim();

  if (newTitle) {
    note.title = newTitle;
  }

  if (newContent) {
    note.content = newContent;
  }

  note.updatedAt = new Date().toISOString();

  saveNotes(notes);

  console.log("Note updated successfully.\n");
}

// Delete Note
async function deleteNote() {
  const notes = loadNotes();

  if (notes.length === 0) {
    console.log("No notes available.\n");
    return;
  }

  viewNotes();

  const id = Number(
    (await ask("Enter note ID to delete: ")).trim()
  );

  const index = notes.findIndex((item) => item.id === id);

  if (index === -1) {
    console.log("Note not found.\n");
    return;
  }

  notes.splice(index, 1);

  saveNotes(notes);

  console.log("Note deleted successfully.\n");
}

// Main Menu
async function menu() {
  console.log("===== CLI NOTES APP =====");
  console.log("1. Add Note");
  console.log("2. View Notes");
  console.log("3. Update Note");
  console.log("4. Delete Note");
  console.log("5. Exit");

  const choice = (await ask("Choose an option: ")).trim();

  switch (choice) {
    case "1":
      await addNote();
      break;

    case "2":
      viewNotes();
      break;

    case "3":
      await updateNote();
      break;

    case "4":
      await deleteNote();
      break;

    case "5":
      console.log("Goodbye!");
      rl.close();
      return;

    default:
      console.log("Invalid option.\n");
  }

  await menu();
}

menu();