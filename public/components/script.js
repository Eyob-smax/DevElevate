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
const noteCardCouter = mainPage.querySelector(".main-notes-card-counter");
const mainToDoSection = document.querySelector("#main-to-do-section");
const projectCardCouter = mainPage.querySelector(".main-projects-card-counter");
const journalCardCouter = mainPage.querySelector(".main-journal-card-counter");
const toDoCardCouter = mainPage.querySelector(".main-to-do-card-counter");
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

openfocusSessionSection.addEventListener("click", () => {
  mainPage.classList.add("hidden");
  mainFocusSessions.classList.remove("hidden");
});

// openfocusSessionSection.addEventListener("click", () => {

// });

async function countLengthNotes(section = "notes") {
  return fetch(`${domain}/${section}`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

projectCardCouter.textContent = "5";
journalCardCouter.textContent = "3";
