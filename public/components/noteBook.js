function getElement(selector, element) {
  if (element) {
    return element.querySelector(selector);
  }
  return document.querySelector(selector);
}

function createElement(element, innerHTML) {
  const Parentelement = document.createElement(element);
  Parentelement.innerHTML = innerHTML;
  return Parentelement;
}

const seachnoteinput = getElement("#search-note");
const seachNoteButton = getElement("#search-note-btn");

const NotesCardContainer = getElement(".cards-container");

const addNoteForm = getElement("#notes-form");
const addNoteBtn = getElement(".add-notes-btn");
const addNotesSection = getElement(".add-notes-section");

function saveNote() {}

function editNote() {}

function deleteNote(element, id) {}

addNoteBtn.addEventListener("click", () => {
  console.log("clicked");
  addNotesSection.classList.toggle("hidden");
  const icon = addNoteBtn.querySelector(".fa-plus");
  icon.classList.toggle("rotate-[135deg]");
});

addNoteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    title: e.target.noteTitle.value,
    notes: e.target.noteBody.value,
    topic: e.target.noteTopic.value,
  };
  if (data.title === "" || data.note === "" || data.topic === "") {
    return alert("Please fill all the fields");
  }

  const isConfirmed = confirm("Are you sure you want to add this note?");
  if (!isConfirmed) return;

  addNotesSection.classList.add("hidden");
  const icon = addNoteBtn.querySelector(".fa-plus");
  icon.classList.remove("rotate-[135deg]");

  fetch(`http://${ip}:${port}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) alert("Error while adding note");
    })
    .catch((err) => err);

  const card = `<div
            id="card-1"
            class="relative max-w-[330px] note-card bg-[#E4FFE6] w-[100%] text-justify rounded-xl shadow-lg shadow-slate-900/5 mx-auto mb-3"
          >
            <div
              class="manipulate-card-buttons flex gap-4 absolute top-1 right-4"
            >
              <div
                onclick="saveNote()"
                id="note-save-btn"
                class="bg-[#F1EEFF] cursor-pointer w-8 h-8 rounded-full hidden items-center justify-center shadow-md"
              >
                <i class="fas fa-save text-[#8068FB]"></i>
              </div>
              <div
                onclick="editNote()"
                id="note-edit-btn"
                class="bg-[#F1EEFF] cursor-pointer w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              >
                <i class="fas fa-edit text-[#8068FB]"></i>
              </div>
              <div
                onclick="deleteNote(this)"
                id="note-delete-btn"
                class="bg-[#F1EEFF] cursor-pointer w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              >
              <div class="note_id"></div>
                <i class="fas fa-trash text-[#8068FB]"></i>
              </div>
            </div>
            <div class="note-card-content mt-5 px-2 py-4 my-2">
              <div class="id hidden"></div>
              <p id="note-title" class="font-sour font-semibold">
               ${data.title}
              </p>
              <p
                id="note-body"
                class="font-sour text-[13px] text-[#9490a8] px-1 py-2"
              >
             ${data.notes}
              </p>
              <div class="flex justify-between pt-2 px-2 border-t-2">
                <h4 class="font-sour font-light">
                  Topic - <span id="note-topic">${data.topic}</span>
                </h4>
                <p id="note-date text-[11px]">${new Date().toDateString()}</p>
              </div>
            </div>
          </div>`;
  NotesCardContainer.insertAdjacentHTML("afterbegin", card);

  addNoteForm.reset();
});

async function getDataFromDb() {
  const res = await fetch(`http://${ip}:${port}/notes`);
  const data = await res.json();
  return data;
}

const result = getDataFromDb().then((data) => {
  data.forEach((document) => {
    const date = new Date(document.createTime);

    const formattedDate = date.toLocaleString("en-US", {
      weekday: "short",
      year: "2-digit",
      month: "short",

      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const DBcard = `<div
    id="card-1"
    class="relative max-w-[330px] note-card bg-[#E4FFE6] w-[100%] text-justify rounded-xl shadow-lg shadow-slate-900/5 mx-auto mb-3"
  >
    <div
      class="manipulate-card-buttons flex gap-4 absolute top-1 right-4"
    >
      <div
        onclick="saveNote()"
        id="note-save-btn"
        class="bg-[#F1EEFF] cursor-pointer w-8 h-8 rounded-full hidden items-center justify-center shadow-md"
      >
        <i class="fas fa-save text-[#8068FB]"></i>
      </div>
      <div
        onclick="editNote()"
        id="note-edit-btn"
        class="bg-[#F1EEFF] cursor-pointer w-8 h-8 rounded-full flex items-center justify-center shadow-md"
      >
        <i class="fas fa-edit text-[#8068FB]"></i>
      </div>
      <div
        onclick="deleteNote(this, this.firstElementChild)"
        id="note-delete-btn"
        class="bg-[#F1EEFF] cursor-pointer w-8 h-8 rounded-full flex items-center justify-center shadow-md"
      >
      <div class="note_id hidden">${document._id}</div>
        <i class="fas fa-trash text-[#8068FB]"></i>
      </div>
    </div>
    <div class="note-card-content mt-5 px-2 py-4 my-2">
      <div class="id hidden"></div>
      <p id="note-title" class="font-sour font-semibold">
       ${document.title}
      </p>
      <p
        id="note-body"
        class="font-sour text-[13px] text-[#9490a8] px-1 py-2"
      >
     ${document.notes}
      </p>
      <div class="flex justify-between pt-2 px-2 border-t-2">
        <h4 class="font-sour font-light">
          Topic - <span id="note-topic">${document.topic}</span>
        </h4>
        <p id="note-date text-[11px]">${formattedDate}</p>
      </div>
    </div>
  </div>`;

    NotesCardContainer.insertAdjacentHTML("afterbegin", DBcard);
  });
});
