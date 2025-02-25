const mainPage = document.querySelector("#main-page");
const opennoteSection = mainPage.querySelector("#note-card");
const openprojectSection = mainPage.querySelector("#projects-card");
const openjournalSection = mainPage.querySelector("#journal-card");
const opentodoSection = mainPage.querySelector("#to-do-card");
const openAiQuestionSection = mainPage.querySelector("#Ai-question-card");
const mainNoteSection = document.querySelector("#note-section");
const openfocusSessionSection = mainPage.querySelector("#focus-session-card");
const openquoteSection = mainPage.querySelector("#quote-card");
const opendarkMode = mainPage.querySelector("#dark-mode");
const mainAiQuetionSection = document.querySelector("#main-Ai-question");
const mainProjectsSection = document.querySelector("#main-projects-section");
const noteCardCouter = mainPage.querySelector(".main-notes-card-counter");
const mainToDoSection = document.querySelector("#main-to-do-section");
const projectCardCouter = mainPage.querySelector(".main-projects-card-counter");
const journalCardCouter = mainPage.querySelector(".main-journal-card-counter");
const toDoCardCouter = mainPage.querySelector(".main-to-do-card-counter");
// const mainFocusSessions = document.querySelector("#focus-session");
opennoteSection.addEventListener("click", () => {
  mainPage.classList.add("hidden");
  mainNoteSection.classList.remove("hidden");
});

openAiQuestionSection.addEventListener("click", () => {
  mainPage.classList.add("hidden");
  mainAiQuetionSection.classList.remove("hidden");
});

opentodoSection.addEventListener("click", () => {
  mainPage.classList.add("hidden");
  mainToDoSection.classList.remove("hidden");
});

openprojectSection.addEventListener("click", () => {
  mainPage.classList.add("hidden");
  mainProjectsSection.classList.remove("hidden");
});

openfocusSessionSection.addEventListener("click", () => {
  mainPage.classList.add("hidden");
  mainFocusSessions.classList.remove("hidden");
});

function countLengthNotes(section = "notes") {
  return fetch(`http://${ip}:${port}/${section}`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}
const notesCounter = countLengthNotes();
/* const projectsCounter = countLengthNotes("projects");
const journalCounter = countLengthNotes("journal"); */
const toDoCounter = countLengthNotes("to-do");

toDoCounter.then((data) => {
  toDoCardCouter.textContent = data.length;
});
notesCounter.then((data) => {
  noteCardCouter.textContent = data.length;
});

projectCardCouter.textContent = "5";
journalCardCouter.textContent = "3";
