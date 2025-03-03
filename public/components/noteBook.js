function getElement(selector, element) {
  if (element) {
    return element.querySelector(selector);
  }
  return document.querySelector(selector);
}

function createElement(
  element,
  className = null,
  textContent = null,
  value = null
) {
  let el = document.createElement(element);

  if (className) {
    el.className = className;
  }
  if (textContent) {
    el.textContent = textContent;
  }
  if (value) {
    el.value = value;
  }
  return el;
}

let boxArray = [];
let noteArray = [];
let boxNumber = 0;

const searchnoteinput = getElement("#search-note");
const searchNoteButton = getElement("#search-note-btn");

const boxCounter = getElement("#note-counter");

const NotesCardContainer = getElement(".cards-container");

const addNoteForm = getElement("#notes-form");
const addBoxesBtn = getElement(".add-boxes-btn");
const addNotesBtn = getElement(".add-notes-btn");
const addNotesSection = getElement(".add-notes-section");
const icon = getElement(".fa-plus");
const icon2 = getElement("#icon2");

const dayContainer = getElement(".day-container");
const formForDayContainer = getElement("#days-container-form");
const dayContainerAddSection = getElement(".create-day-container");

const addBoxesSectionContainer = getElement("#add-boxes-section-container");
const addNotesSectionContainer = getElement("#add-notes-section-container");
const footerNotes = getElement("#footer-for-notes");

let currentBoxInfo = {
  title: "",
  date: "",
};

const colors = [
  "#F5F1EB",
  "#EAE7DC",
  "#DED7C9",
  "#F0E6E0",
  "#D6D3D1",
  "#F7F3EE",
  "#E4DFDA",
  "#F8F6F2",
];

getElement("#backToMain", mainNoteSection).addEventListener("click", () => {
  mainNoteSection.classList.add("hidden");
  mainPage.classList.remove("hidden");
  addNotesSection.classList.add("hidden");
  dayContainerAddSection.classList.add("hidden");
  icon.classList.remove("rotate-[135deg]");
  icon2.classList.remove("rotate-[135]deg");
  currentBoxInfo = {
    title: "",
    date: "",
  };
});

getElement("#backToBoxes", mainNoteSection).addEventListener(
  "click",
  async () => {
    addNotesSectionContainer.style.display = "none";
    icon2.classList.remove("rotate-[135]deg");
    addBoxesSectionContainer.style.display = "block flex";
    NotesCardContainer.innerHTML = "";
    currentBoxInfo = {
      title: "",
      date: "",
    };
    const { data, success } = await getBoxData();
    if (success) {
      data.forEach((element) => {
        const card = createDayContainer(
          element.title,
          element.date,
          element.number,
          element.index
        );
        NotesCardContainer.appendChild(card);
      });
    }
  }
);

addBoxesBtn.addEventListener("click", closeBoxAddForm);
addNotesBtn.addEventListener("click", closeNoteAddForm);

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function closeNoteAddForm() {
  addNotesSection.classList.toggle("hidden");
  if (addNotesSection.classList.contains("hidden")) {
    icon.classList.remove("rotate-[135deg]");
  } else {
    icon.classList.add("rotate-[135deg]");
  }
}

function closeBoxAddForm() {
  dayContainerAddSection.classList.toggle("hidden");
  if (dayContainerAddSection.classList.contains("hidden")) {
    icon2.classList.remove("rotate-[135deg]");
  } else {
    icon2.classList.add("rotate-[135deg]");
  }
}

function createDayContainer(title, date, notesNumber, number) {
  const dayContainer = createElement(
    "div",
    "day-container w-[calc(100% - 50px)] custom-height-mq:h-[170px] bg-[url(../images/day-container.png)] h-[200px] flex-col items-center justify-center mx-auto rounded-xl shadow-lg shadow-slate-900/5 relative box-border cursor-pointer  my-2 mx-2"
  );

  const h2 = createElement("h2", "text-white  p-5 font-robot text-2xl", title);
  const h1 = createElement(
    "h1",
    "text-white font-roboto text-3xl pl-4 pt-5",
    number || "2"
  );
  const h4 = createElement(
    "h4",
    "today text-white absolute -translate-x-1/2 -translate-y-1/2 bottom-0 left-20"
  );
  const span1 = createElement("span", null, date);
  span1.setAttribute("id", "date");

  const p = createElement(
    "p",
    "absolute right-0 bottom-0 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] font-sour text-[25px] text-black self-end m-0 flex rounded-full items-center justify-center bg-[gold] shadow-lg shadow-slate-900 ring-slate-400 ring-1",
    notesNumber || "1"
  );

  const p2 = createElement(
    "p",
    "absolute right-14 bottom-0 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] font-sour text-[25px] text-black self-end m-0 flex rounded-full items-center justify-center bg-[#F1EEFF] shadow-lg shadow-slate-900 ring-slate-400 ring-1"
  );

  const i = createElement("i", "text-[15px] fas fa-trash-alt");

  p2.appendChild(i);

  h4.appendChild(span1);

  p2.addEventListener("click", (e) => {
    deleteBox(dayContainer, title, date);
    e.stopPropagation();
  });

  dayContainer.addEventListener("click", () => {
    openNotesAddForm(title, date);
    currentBoxInfo.title = title;
    currentBoxInfo.date = date;
  });

  dayContainer.appendChild(h2);
  dayContainer.appendChild(h1);
  dayContainer.appendChild(h4);
  dayContainer.appendChild(p);
  dayContainer.appendChild(p2);

  return dayContainer;
}

// addNoteForm.addEventListener("submit", );
document.addEventListener("DOMContentLoaded", async () => {
  const { data, success } = await getBoxData();

  if (success) {
    boxNumber = data.length;
    boxCounter.textContent = boxNumber;
    data.forEach((element) => {
      const card = createDayContainer(
        element.title,
        element.date,
        element.number,
        element.index
      );
      NotesCardContainer.appendChild(card);
    });
  } else {
    const data = loadDataFromLS("box-data");
    if (data) {
      data.forEach((element) => {
        const card = createDayContainer(
          element.title,
          element.date,
          0,
          element.index
        );
        NotesCardContainer.appendChild(card);
      });
    }
  }
});

formForDayContainer.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(formForDayContainer);

  const data = {
    title: formData.get("BoxTitle"),
    date: formData.get("BoxDate"),
  };

  const boxData = await sendDataToServer(data);
  boxArray.push(boxData);

  const card = createDayContainer(
    boxData.title,
    boxData.date,
    0,
    boxData.index
  );

  saveToLS("box-data", boxArray);
  NotesCardContainer.appendChild(card);

  boxNumber++;
  boxCounter.textContent = boxNumber;
  closeBoxAddForm();

  formForDayContainer.reset();
});

async function deleteBox(container, title, date) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#00a86b",
    confirmButtonText: "Yes, delete it!",
  });

  const confirm = result.isConfirmed;

  if (!confirm) return;
  boxNumber--;
  boxCounter.textContent = boxNumber;

  const res = await fetch("http://localhost:8090/notes/box", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, date }),
  });

  const resData = await res.json();
  if (!resData.success) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
    return;
  }

  Swal.fire("Deleted!", "Your file has been deleted.", "success");
  boxArray = boxArray.filter(
    (card) => card.title !== title && card.date !== date
  );
  saveToLS("box-data", boxArray);
  container.remove();
}

function saveToLS(name, data) {
  if (typeof data !== "string") {
    localStorage.setItem(name, JSON.stringify(data));
    return;
  }
  localStorage.setItem(name, data);
}

function loadDataFromLS(name) {
  return JSON.parse(localStorage.getItem(name));
}

function delteFromLS(item) {
  localStorage.removeItem(item);
}

async function sendDataToServer(data) {
  const response = await fetch("http://localhost:8090/notes/box", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  return res;
}

async function getBoxData() {
  const response = await fetch("http://localhost:8090/notes/box");
  const data = await response.json();
  return data;
}

async function openNotesAddForm(title, date) {
  NotesCardContainer.innerHTML = "";
  addBoxesSectionContainer.style.display = "none";
  addNotesSectionContainer.style.display = "block flex";
  const notes = await fetchNotes(title, date);
  if (!notes) return;
  notes.forEach((note) => {
    const card = createNoteCard(note.title, note.topic, note.note);
    NotesCardContainer.appendChild(card);
  });
}

addNoteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleNotesForm();
});

function createNoteCard(title, topic, note) {
  // Create the main card div
  let card = createElement(
    "div",
    `note-card min-h-[100px] py-3 px-2 relative max-h-[300px] bg-[${getRandomColor()}] rounded-xl shadow-lg shadow-slate-900/5 mx-auto mt-5`
  );
  card.style.width = "calc(100% - 20px)";

  // Header section
  let header = createElement(
    "div",
    "flex items-center justify-between px-2 py-1"
  );
  let titleEl = createElement(
    "h1",
    "font-league text-[16px] font-semibold",
    title
  );

  // Buttons container
  let btnContainer = createElement(
    "div",
    "flex items-center space-x-1 justify-end"
  );
  let editBtn = createElement(
    "button",
    "edit-note w-8 h-8 rounded-full bg-[#F1EEFF]"
  );
  let saveBtn = createElement(
    "button",
    "save-note w-8 h-8 rounded-full bg-[#F1EEFF]"
  );

  let saveIcon = createElement("i", "fas fa-save text-[#8068fb]");

  let editIcon = createElement("i", "fas fa-edit text-[#8068FB]");
  let deleteBtn = createElement(
    "button",
    "delete-note w-8 h-8 rounded-full bg-[#F1EEFF]"
  );
  let deleteIcon = createElement("i", "fa fa-trash text-[#8068FB]");

  // Append icons to buttons
  editBtn.appendChild(editIcon);
  deleteBtn.appendChild(deleteIcon);
  saveBtn.appendChild(saveIcon);

  // Append buttons to button container
  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(deleteBtn);

  // Append title and buttons to header
  header.appendChild(titleEl);
  header.appendChild(btnContainer);

  // Note content section
  let noteContainer = createElement("div", "mb-2");
  let noteText = createElement(
    "p",
    "font-roboto text-justify px-3 text-[14px] text-slate-600 leading-4 max-h-[150px] overflow-y-scroll scrollbar",
    note
  );
  noteContainer.appendChild(noteText);

  // Footer section
  let footer = createElement(
    "div",
    "flex items-center justify-between px-2 border-t-2 border-t-slate-200"
  );
  let topicEl = createElement("h3", null, `Topic- `);
  let topicSpan = createElement("span", "topic", topic || "General");
  topicEl.appendChild(topicSpan);
  let dateEl = createElement("p", "date", new Date().toDateString());

  // Append topic and date to footer
  footer.appendChild(topicEl);
  footer.appendChild(dateEl);

  // Append all sections to the main card
  card.appendChild(header);
  card.appendChild(noteContainer);
  card.appendChild(footer);

  editBtn.addEventListener("click", (e) => {
    editNote(card, titleEl, noteText, topicSpan);

    if (e.currentTarget.classList.contains("edit-note")) {
      btnContainer.appendChild(saveBtn);
      btnContainer.removeChild(editBtn);
    } else {
      e.currentTarget.className = "fas fa-save text-[#8068FB]";
    }
  });

  saveBtn.addEventListener("click", (e) => {
    console.log(currentBoxInfo.title, currentBoxInfo.date);
    saveNote(
      titleEl,
      noteText,
      topicSpan,
      title,
      note,
      topic,
      currentBoxInfo.title,
      currentBoxInfo.date
    );
    if (e.currentTarget.classList.contains("save-note")) {
      btnContainer.appendChild(editBtn);
      btnContainer.removeChild(saveBtn);
    } else {
      e.currentTarget.className = "fas fa-edit text-[#8068FB]";
      btnContainer.removeChild(saveBtn);
      btnContainer.appendChild(editBtn);
    }
  });

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteNote(card, title, note, topic);
  });
  return card;
}

async function fetchNotes(title, date) {
  try {
    const response = await fetch(
      "http://localhost:8090/notes?parentTitle=" +
        encodeURIComponent(title) +
        "&parentDate=" +
        encodeURIComponent(date)
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log("Error fetching notes", err.message);
  }
}

async function handleNotesForm() {
  const formData = new FormData(addNoteForm);
  const data = {
    parentTitle: currentBoxInfo.title,
    parentDate: currentBoxInfo.date,
    title: formData.get("noteTitle"),
    note: formData.get("noteBody"),
    topic: formData.get("noteTopic"),
  };
  const result = await sendNotesToServer(data);
  if (!result.success) {
    Swal.fire("Error", result.message, "error");
    return;
  }
  Swal.fire("Success", result.message, "success");

  const card = createNoteCard(data.title, data.topic, data.note);
  NotesCardContainer.appendChild(card);

  addNoteForm.reset();
  closeNoteAddForm();
}

async function sendNotesToServer(data) {
  const response = await fetch("http://localhost:8090/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  return res;
}

function editNote() {}

async function deleteNote(card, title, note, topic) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#00a86b",
    confirmButtonText: "Yes, delete it!",
  });

  const confirm = result.isConfirmed;

  if (!confirm) return;

  const res = await fetch("http://localhost:8090/notes", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, note, topic }),
  });

  const { success, message } = await res.json();
  if (!success) {
    return swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
  card.remove();
  Swal.fire("Deleted!", message, "success");
}

function editNote(card, titleEl, noteText, topicSpan) {
  titleEl.contentEditable = true;
  titleEl.style.outline = "black 1px solid";
  topicSpan.style.outline = "black 1px solid";
  noteText.style.outline = "black 1px solid";
  titleEl.style.padding = "0 10px";
  noteText.contentEditable = true;
  topicSpan.contentEditable = true;
  topicSpan.style.padding = "0 10px";

  limitText(titleEl, 29);
  limitText(topicSpan, 10);

  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(titleEl);
  range.collapse(false); // Move to the end
  selection.removeAllRanges();
  selection.addRange(range);

  titleEl.focus();
}

function saveNote(
  titleEl,
  noteText,
  topicSpan,
  title,
  note,
  topic,
  parentTitle,
  parentDate
) {
  titleEl.contentEditable = false;
  titleEl.style.outline = "none";
  noteText.contentEditable = false;
  noteText.style.outline = "none";
  topicSpan.contentEditable = false;
  topicSpan.style.outline = "none";

  titleEl.style.padding = "0";
  noteText.style.padding = "0";

  const data = {
    parentTitle,
    parentDate,
    title,
    note,
    topic,
    newTitle: titleEl.textContent,
    newTopic: topicSpan.textContent,
    newNote: noteText.textContent,
  };

  updateEditedNotes(data);
}

async function updateEditedNotes(data) {
  const response = await fetch("http://localhost:8090/notes", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();
  if (!res.success) {
    return Swal.fire("Error", res.message, "error");
  }
  Swal.fire("Success", res.message, "success");
}

function limitText(textElement, limit) {
  textElement.addEventListener("keydown", (e) => {
    if (
      textElement.textContent.length > limit &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "ArrowUp" &&
      e.key !== "ArrowDown" &&
      e.key !== "Enter" &&
      e.key !== "Tab" &&
      e.key !== "Shift" &&
      e.key !== "Control" &&
      e.key !== "Alt"
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `You can only enter ${limit} characters`,
      });
      e.preventDefault();
    }
  });
}
