function getElement(selector, element) {
  if (element) {
    return element.querySelector(selector);
  }
  return document.querySelector(selector);
}

function createElement(
  element,
  className = null,
  innerText = null,
  parent = null,
  value = null
) {
  let el = document.createElement(element);
  if (parent) {
    el = parent.createElement(element);
  }
  if (className) {
    el.className = className;
  }
  if (innerText) {
    el.innerText = innerText;
  }
  if (value) {
    el.value = value;
  }
  if (parent) {
    parent.appendChild(el);
  }
  return el;
}

const searchnoteinput = getElement("#search-note");
const searchNoteButton = getElement("#search-note-btn");

const NotesCardContainer = getElement(".cards-container");

const addNoteForm = getElement("#notes-form");
const addNoteBtn = getElement(".add-notes-btn");
const addNotesSection = getElement(".add-notes-section");
const icon = addNoteBtn.querySelector(".fa-plus");

addNoteBtn.addEventListener("click", () => {
  addNotesSection.classList.toggle("hidden");
  if (addNotesSection.classList.contains("hidden")) {
    icon.classList.remove("rotate-[135deg]");
  } else {
    icon.classList.add("rotate-[135deg]");
  }
});

getElement(".fa-chevron-left", mainNoteSection).addEventListener(
  "click",
  () => {
    mainNoteSection.classList.add("hidden");
    mainPage.classList.remove("hidden");
    addNotesSection.classList.add("hidden");
    icon.classList.remove("rotate-[135deg]");
  }
);

addNoteForm.addEventListener("submit", saveNote);

function saveNote(e) {
  e.preventDefault();
}

function editNote() {}

function deleteNote(element, id) {}
