function createElement(
  el,
  className = null,
  textContent = null,
  id = null,
  type = null,
  value = null
) {
  let element = document.createElement(el);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  if (id) element.id = id;
  if (type) element.type = type;
  if (value) element.value = value;
  return element;
}

function getElement(selector, parent = document) {
  if (parent) return parent.querySelector(selector);
  return document.querySelector(selector);
}

let totalToDoElement = getElement("#todo-counter");
const mainTodoContainer = getElement(".main-to-do-container");
const todosForm = getElement("#todo-form");
let boxesCounter = 0;
let todosCounter = 0;

getElement("#backToMain", mainToDoSection).addEventListener("click", () => {
  mainPage.classList.remove("hidden");
  mainToDoSection.classList.add("hidden");
});

let currentToDoBox = {
  title: "",
  date: "",
};

getElement("#backToBoxes", mainToDoSection).addEventListener(
  "click",
  async () => {
    setUiChanges(false, true);
    footerBoxSection.style.display = "block flex";
    footerTodoSection.style.display = "none";
    mainTodoContainer.innerHTML = "";
    currentToDoBox = {};
    await fetchTodoBox();
  }
);

document.addEventListener("DOMContentLoaded", async () => {
  fetchTodoBox();
});

function createTodoBox(title, date, number, notesNumber) {
  // Create main container
  const card = createElement(
    "div",
    "todo-day-container w-[calc(100% - 50px)] custom-height-mq:h-[170px] bg-[url(../images/todo-box.png)] h-[200px] flex-col items-center justify-center mx-auto rounded-xl shadow-lg shadow-slate-900/5 relative box-border cursor-pointer my-2"
  );

  // Create title
  const titleElement = createElement(
    "h2",
    "text-white p-5 font-robot text-2xl",
    title
  );

  // Create count
  const countElement = createElement(
    "h1",
    "text-white font-roboto text-3xl pl-4 pt-5",
    number || "0"
  );

  const dateElement = createElement(
    "h4",
    "today text-white absolute -translate-x-1/2 -translate-y-1/2 bottom-0 left-20"
  );

  const dateSpan = createElement("span", null, date, "date");
  dateElement.appendChild(dateSpan);

  const counterBubble = createElement(
    "p",
    "absolute right-0 bottom-0 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] font-sour text-[25px] text-black self-end m-0 flex rounded-full items-center justify-center bg-[gold] shadow-lg shadow-slate-900 ring-slate-400 ring-1",
    notesNumber || "0"
  );

  // Create delete button
  const deleteButton = createElement(
    "p",
    "absolute right-14 bottom-0 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] font-sour text-[25px] text-black self-end m-0 flex rounded-full items-center justify-center bg-[#F1EEFF] shadow-lg shadow-slate-900 ring-slate-400 ring-1"
  );
  const deleteIcon = createElement("i", "text-[15px] fas fa-trash-alt");
  deleteButton.appendChild(deleteIcon);

  deleteButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    deleteTodoBox(card, title, date);
  });

  // Append all elements to the card
  card.appendChild(titleElement);
  card.appendChild(countElement);
  card.appendChild(dateElement);
  card.appendChild(counterBubble);
  card.appendChild(deleteButton);

  card.addEventListener("click", () => {
    currentToDoBox.title = title;
    currentToDoBox.date = date;
    openTodo(title, date);
  });

  return card;
}

async function fetchTodoBox() {
  try {
    const response = await fetch(`http://${ip}:${port}/to-do/box`);
    const { success, todoBox } = await response.json();
    if (!success) {
      return Swal.fire({
        icon: "error",
        text: "Failed to fetch todos",
        title: "Error",
      });
    }
    todoBox.forEach((box) => {
      const { title, date, number, index } = box;
      const card = createTodoBox(title, date, index, number);
      mainTodoContainer.insertAdjacentElement("afterbegin", card);
    });

    toDoCardCouter.textContent =
      totalToDoElement.textContent =
      boxesCounter =
        todoBox.length;
  } catch (err) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.message,
    });
  }
}

function createTodoCard(content, date, precedence = "High") {
  const card = createElement(
    "div",
    "todo-card w-[97%] max-h-[250px] overflow-y-scroll scrollbar mx-auto rounded-lg shadow-lg bg-[#E5E4E9] shadow-slate-900/5 p-1 my-2"
  );

  const contentContainer = createElement(
    "div",
    "max-h-[100px] overflow-y-scroll to-do-content mb-2 mt-1"
  );
  const textElement = createElement(
    "h2",
    "to-do-text text-wrap  px-3 font-roboto  text-[16px]",
    content
  );
  contentContainer.appendChild(textElement);

  const buttonContainer = createElement(
    "div",
    "flex space-x-3 font-semibold text-[13px]"
  );
  const doneButton = createElement(
    "button",
    "complete-todo w-16 rounded-xl bg-[gold]",
    "Done"
  );
  const precedenceButton = createElement(
    "button",
    "w-16 rounded-xl bg-black text-white",
    precedence,
    "precedence"
  );
  buttonContainer.appendChild(doneButton);
  buttonContainer.appendChild(precedenceButton);

  // Time and action buttons container
  const timeAndButtons = createElement(
    "div",
    "time-and-buttons flex items-center justify-between mx-2"
  );
  const dateElement = createElement("p", null, " ");
  const dateIcon = createElement("i", "fa fa-calendar-check");
  dateElement.appendChild(dateIcon);
  dateElement.appendChild(document.createTextNode(` ${date}`));

  // Action buttons
  const buttonGroup = createElement("div", "buttons flex space-x-4");
  const deleteButton = createElement(
    "button",
    "delete-todo rounded-full w-8 h-8 bg-white flex justify-center items-center"
  );
  const deleteIcon = createElement("i", "fa fa-trash text-[#8068FB]");
  deleteButton.appendChild(deleteIcon);

  deleteButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    deleteNote(card, content, date);
  });

  const editButton = createElement(
    "button",
    "edit-todo rounded-full w-8 h-8 bg-white flex justify-center items-center"
  );
  const editIcon = createElement("i", "fa fa-pen text-[#8068FB]");
  editButton.appendChild(editIcon);
  const saveButton = createElement(
    "button",
    "save-todo rounded-full w-8 h-8 bg-white flex justify-center items-center"
  );
  editButton.appendChild(editIcon);
  const saveIcon = createElement("i", "fa fa-save text-[#8068FB]");
  saveButton.appendChild(saveIcon);

  buttonGroup.appendChild(deleteButton);
  buttonGroup.appendChild(editButton);

  timeAndButtons.appendChild(dateElement);
  timeAndButtons.appendChild(buttonGroup);

  // Append all elements to the card
  card.appendChild(contentContainer);
  card.appendChild(buttonContainer);
  card.appendChild(timeAndButtons);

  editButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    editNote(textElement, precedenceButton);

    if (editButton.classList.contains("edit-todo")) {
      buttonGroup.removeChild(editButton);
      buttonGroup.appendChild(saveButton);
    }
  });

  saveButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    saveNotes(content, date, precedence, textElement, precedenceButton);

    if (saveButton.classList.contains("save-todo")) {
      buttonGroup.removeChild(saveButton);
      buttonGroup.appendChild(editButton);
    }
  });

  return card;
}

const footerBoxSection = getElement(".footer-box-section");
const addNewBoxSection = getElement(".create-todo-days-container");
const todoBoxForm = getElement("#todo-days-container-form");
const addTodoBoxBtn = getElement("#add-todo-box-btn");

const footerTodoSection = getElement(".footer-todo-section");
const addNewTodoSection = getElement(".add-todo-section");
const todoForm = getElement("#todo-form");
const addTodoBtn = getElement("#add-todo-btn");

footerTodoSection.style.display === "block flex"
  ? (totalToDoElement.textContent = boxesCounter)
  : (totalToDoElement.textContent = todosCounter);

todoBoxForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await handleBoxForm();
  todoBoxForm.reset();
  openBoxAddForm();
});

addTodoBtn.addEventListener("click", openToDoForm);

async function handleBoxForm() {
  try {
    const formData = new FormData(todoBoxForm);
    const data = {
      title: formData.get("todoBoxTitle"),
      date: formData.get("todoBoxDate"),
    };

    const response = await fetch(`http://${ip}:${port}/to-do/box`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const { success, message, todoBoxData } = await response.json();
    if (!success) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text: message,
    });
    const card = createTodoBox(
      todoBoxData.title,
      todoBoxData.date,
      todoBoxData.number,
      todoBoxData.index
    );
    mainTodoContainer.insertAdjacentElement("afterbegin", card);
    boxesCounter++;
    totalToDoElement.textContent = boxesCounter;
    mainTodoContainer.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (err) {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: err.message,
    });
  }
}

addTodoBoxBtn.addEventListener("click", openBoxAddForm);

function openBoxAddForm() {
  addNewBoxSection.classList.toggle("hidden");
  if (addNewBoxSection.classList.contains("hidden")) {
    if (
      getElement(".fa-plus", addTodoBoxBtn).classList.contains(
        "rotate-[135deg]"
      )
    ) {
      getElement(".fa-plus", addTodoBoxBtn).classList.remove("rotate-[135deg]");
    }
  } else if (!addNewBoxSection.classList.contains("hidden")) {
    getElement(".fa-plus", addTodoBoxBtn).classList.add("rotate-[135deg]");
  }
}

async function deleteTodoBox(card, title, date) {
  try {
    const check = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (!check.isConfirmed) return;

    const response = await fetch(`http://${ip}:${port}/to-do/box`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, date }),
    });

    const { success, message } = await response.json();
    if (!success) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text: message,
    });
    card.remove();
    boxesCounter--;
    totalToDoElement.textContent = boxesCounter;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message,
    });
  }
}

function setUiChanges(todo, box = null) {
  if (todo) {
    footerBoxSection.style.display = "none";
    footerTodoSection.style.display = "block flex";
    addNewBoxSection.classList.add("hidden");
    mainTodoContainer.innerHTML = "";
  } else if (box) {
    footerBoxSection.classList.remove("hidden");
    footerTodoSection.classList.add("hidden");
    addNewTodoSection.classList.add("hidden");
  }
}

async function openTodo(title, date) {
  setUiChanges(true);
  todoForm.reset();
  const { success, todo } = await loadTododos(title, date);
  if (!success) {
    return Swal.fire({
      icon: "error",
      title: "Error",
      text: "cannot load todos",
    });
  }
  todo.forEach((t) => {
    const card = createTodoCard(t.todo, t.date, t.precedence);
    mainTodoContainer.insertAdjacentElement("afterbegin", card);
  });
  todosCounter = todo.length;
  totalToDoElement.textContent = todosCounter;
}

async function loadTododos(title, date) {
  try {
    const response = await fetch(
      `http://${ip}:${port}/to-do?parentTitle=${title}&parentDate=${date}`
    );
    const todos = await response.json();
    if (!todos.success) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "cannot load todos",
      });
    }
    return todos;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message,
    });
  }
}

function openToDoForm() {
  addNewTodoSection.classList.toggle("hidden");
  if (addNewTodoSection.classList.contains("hidden")) {
    if (
      getElement(".fa-plus", addTodoBtn).classList.contains("rotate-[135deg]")
    ) {
      getElement(".fa-plus", addTodoBtn).classList.remove("rotate-[135deg]");
    }
  } else if (!addNewTodoSection.classList.contains("hidden")) {
    getElement(".fa-plus", addTodoBtn).classList.add("rotate-[135deg]");
  }
}

todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await handleTodoSubmission();
  todoForm.reset();
  openToDoForm();
});

async function handleTodoSubmission() {
  try {
    const formData = new FormData(todoForm);
    const data = {
      parentTitle: currentToDoBox.title,
      parentDate: currentToDoBox.date,
      todo: formData.get("todoBody"),
      date: formData.get("todoDate"),
      priority: formData.get("priority"),
    };
    console.log(data);

    const response = await fetch(`http://${ip}:${port}/to-do`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!result.success) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message,
      });
      return;
    }
    const card = createTodoCard(
      result.todoData.todo,
      result.todoData.date,
      result.todoData.priority
    );
    mainTodoContainer.insertAdjacentElement("afterbegin", card);
    todosCounter++;
    totalToDoElement.textContent = todosCounter;
    mainTodoContainer.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message,
    });
  }
}

async function deleteNote(card, todo, date) {
  try {
    const check = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (!check.isConfirmed) return;

    const response = await fetch(`http://${ip}:${port}/to-do`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo, date }),
    });

    const result = await response.json();
    if (!result.success) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Cannot delete note",
      });
    }
    card.remove();
    todosCounter--;
    totalToDoElement.textContent = todosCounter;
    Swal.fire({
      icon: "success",
      title: "Success",
      text: result.message,
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong, retry!",
    });
  }
}

function editNote(todoEl, priorityBtn) {
  todoEl.contentEditable = true;
  todoEl.style.outline = "1px solid black";
  todoEl.style.padding = "5px";
  priorityBtn.contentEditable = true;
  priorityBtn.style.outline = "1px solid black";
  priorityBtn.style.fontWeight = "900";

  limitText(todoEl, 150);
  limitText(priorityBtn, 5);

  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(todoEl);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  todoEl.focus();
}

async function saveNotes(
  todo,
  date,
  precedence,
  textElement,
  precedenceButton
) {
  try {
    const data = {
      parentTitle: currentToDoBox.title,
      parentDate: currentToDoBox.date,
      todo,
      date,
      priority: precedence,
      newTodo: textElement.textContent,
      newPriority: precedenceButton.textContent,
    };

    const response = await fetch(`http://${ip}:${port}/to-do`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const { success, message } = await response.json();
    if (!success) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
      defaultsForSave(textElement, precedenceButton);
      return;
    }
    console.log("JKSFHLSKJHSKLJASDHKJS");
    Swal.fire({
      icon: "success",
      title: "Success",
      text: message,
    });
    defaultsForSave(textElement, precedenceButton);
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong, retry!",
    });
    defaultsForSave(textElement, precedenceButton);
  }
}

function defaultsForSave(textElement, precedenceButton) {
  textElement.contentEditable = false;
  textElement.style.outline = "none";
  textElement.style.padding = "0";
  precedenceButton.contentEditable = false;
  precedenceButton.style.outline = "none";
  precedenceButton.style.fontWeight = "normal";
}
