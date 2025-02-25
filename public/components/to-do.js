const filterToDo = mainToDoSection.querySelector(".todo-filter-section");
const todoCount = mainToDoSection.querySelector("#todo-counter");

const toDoForm = mainToDoSection.querySelector("#to-do-form");

const mainTodosContainer = mainToDoSection.querySelector(
  ".main-to-do-container"
);
const todos = mainTodosContainer.getElementsByClassName("todo-card");

const addTodoSection = mainToDoSection.querySelector(".add-todo-section");
const addTodoFormBtn = addTodoSection.querySelector(".add-todo-btn-to-list");
const addToDoBtn = mainToDoSection.querySelector("#add-todos-btn");

const todoBody = addTodoSection.querySelector(".add-todo-body");
const todoDate = addTodoSection.querySelector(".add-todo-date");
const todoPriority = addTodoSection.querySelector("#todo-priority");

const deleteTodo = mainTodosContainer.querySelectorAll(".delete-todo");
const completeTodo = mainTodosContainer.querySelectorAll(".complete-todo");
const displayPriority = mainTodosContainer.querySelectorAll("#precedence");
const editTodo = mainTodosContainer.querySelectorAll(".edit-todo");
let counerNoTodo = 0;

const resultsFromDB = getTodoFromDB();
resultsFromDB.then((data) => {
  data.map((todo) => {
    const todos = `<div
    class="todo-card w-[97%] mb-2 max-h-[200px] overflow-y-scroll scrollbar mx-auto rounded-lg shadow-lg bg-[#E5E4E9] shadow-slate-900/5 p-1"
  >
    <div class="to-do-content mb-4">
      <h2
        class="to-do-text text-justify px-3 font-roboto text-[16px] font-sour"
      >
        ${todo.note}
      </h2>
    </div>
    <div class="flex space-x-3 font-semibold text-[13px]">
      <button  onclick="completeToDo(this.parentElement.parentElement.parentElement)" class="complete-todo w-16 rounded-xl bg-[gold]">
        Pending
      </button>
      <button id="precedence" class="w-16 rounded-xl bg-black text-white">
        ${todo.priority}
      </button>
    </div>
    <div class="time-and-buttons flex items-center justify-between mx-2">
      <p><i class="fa fa-calendar-check"></i> ${todo.date}</p>
      <div class="buttons flex space-x-4">
        <button onclick="deleteToDo(this.parentElement.parentElement.parentElement)" 
          class="delete-todo rounded-full w-8 h-8 bg-white justify-center items-center"
        >
          <i class="fa fa-trash text-[#8068FB]"></i>
        </button>
        <button onclick="editToDo(this.parentElement.parentElement.parentElement)"
          class="edit-todo rounded-full w-8 h-8 bg-white justify-center items-center"
        ><div class="hidden">${todo.id}</div>
          <i class="fa fa-pen text-[#8068FB]"></i>
        </button>
        <button onclick="saveToDo(this.parentElement.parentElement.parentElement)"
          class="hidden save-todo rounded-full w-8 h-8 bg-white justify-center items-center"
        >
          <i class="fa fa-save text-[#8068FB]"></i>
        </button>
      </div>
    </div>
  </div>`;
    mainTodosContainer.insertAdjacentHTML("afterbegin", todos);
  });
});
addTodoFormBtn.addEventListener("click", () => {
  if (todoBody.value !== "" && todoDate.value !== "") {
    counerNoTodo++;
    let template = ` <div
          class="todo-card w-[97%] mb-2 max-h-[200px] overflow-y-scroll scrollbar mx-auto rounded-lg shadow-lg bg-[#E5E4E9] shadow-slate-900/5 p-1"
        >
          <div class="to-do-content mb-4">
            <h2
              class="to-do-text text-justify px-3 font-roboto text-[16px] font-sour"
            >
              ${todoBody.value}
            </h2>
          </div>
          <div class="flex space-x-3 font-semibold text-[13px]">
            <button  onclick="completeToDo(this.parentElement.parentElement.parentElement)" class="complete-todo w-16 rounded-xl bg-[gold]">
              Pending
            </button>
            <button id="precedence" class="w-16 rounded-xl bg-black text-white">
              ${todoPriority.value}
            </button>
          </div>
          <div class="time-and-buttons flex items-center justify-between mx-2">
            <p><i class="fa fa-calendar-check"></i> ${todoDate.value}</p>
            <div class="buttons flex space-x-4">
              <button onclick="deleteToDo(this.parentElement.parentElement.parentElement)" 
                class="delete-todo rounded-full w-8 h-8 bg-white justify-center items-center"
              >
                <i class="fa fa-trash text-[#8068FB]"></i>
              </button>
              <button onclick="editToDo(this.parentElement.parentElement.parentElement)"
                class="edit-todo rounded-full w-8 h-8 bg-white justify-center items-center"
              >
                <i class="fa fa-pen text-[#8068FB]"></i>
              </button>
              <button onclick="saveToDo(this.parentElement.parentElement.parentElement)"
                class="hidden save-todo rounded-full w-8 h-8 bg-white justify-center items-center"
              >
                <i class="fa fa-save text-[#8068FB]"></i>
              </button>
            </div>
          </div>
        </div>`;

    addTodoSection.classList.add("hidden");
    todoCount.textContent = counerNoTodo;

    mainTodosContainer.insertAdjacentHTML("afterbegin", template);
    const icon = addToDoBtn.querySelector(".fa-plus");
    icon.classList.toggle("rotate-[135deg]");
  } else {
    alert("Please fill in the required fields");
  }
});

mainToDoSection
  .querySelector(".fa-chevron-left")
  .addEventListener("click", () => {
    mainToDoSection.classList.add("hidden");
    mainPage.classList.remove("hidden");
    addTodoSection.classList.add("hidden");
  });

mainToDoSection.addEventListener("click", (e) => {
  if (
    !e.target.parentElement.parentElement.matches(".add-todo-section") &&
    !e.target.matches(".add-todo-section") &&
    !e.target.parentElement.parentElement.matches("#to-do-form") &&
    !e.target.matches("#add-todos-btn") &&
    !e.target.matches(".duration-300")
  ) {
    addTodoSection.classList.add("hidden");
    const icon = addToDoBtn.querySelector(".fa-plus");
    icon.classList.remove("rotate-[135deg]");
  }
});

addToDoBtn.addEventListener("click", () => {
  addTodoSection.classList.toggle("hidden");
  const icon = addToDoBtn.querySelector(".fa-plus");
  icon.classList.toggle("rotate-[135deg]");
});

function deleteToDo(card) {
  const idElement = card.querySelector(".edit-todo");
  const id = idElement.firstElementChild.innerHTML;

  fetch(`http://${ip}:${port}/to-do/delete`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });

  card.remove();
  if (counerNoTodo > 0) {
    counerNoTodo--;
    todoCount.textContent = counerNoTodo;
  }
}

function editToDo(card) {
  card.querySelector(".to-do-text").setAttribute("contenteditable", true);
  card
    .querySelector(".fa-calendar-check")
    .setAttribute("contenteditable", true);
  card.querySelector(".save-todo").classList.remove("hidden");
  card.querySelector(".edit-todo").classList.add("hidden");
  card.querySelector(".save-todo").classList.remove("hidden");
}

function saveToDo(card) {
  card.querySelector(".save-todo").classList.add("hidden");
  card.querySelector(".edit-todo").classList.remove("hidden");
  card.querySelector(".edit-todo").classList.remove("hidden");
  card.querySelector(".to-do-text").setAttribute("contenteditable", false);
  card
    .querySelector(".fa-calendar-check")
    .setAttribute("contenteditable", false);
}

function completeToDo(card) {
  if (card.querySelector(".complete-todo").innerHTML === "√") {
    card.querySelector(".complete-todo").classList.remove("bg-[green]");
    card.querySelector(".complete-todo").innerHTML = "Pending";
    card.querySelector(".complete-todo").classList.add("bg-[gold]");
  } else {
    card.querySelector(".complete-todo").innerHTML = "√";
    card.querySelector(".complete-todo").classList.add("bg-[green]");
  }
}

toDoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const toDoData = {
    todo: toDoForm.todoBody.value,
    date: toDoForm.todoDate.value,
    priority: toDoForm.priority.value,
  };

  const res = await fetch(`http://${ip}:${port}/to-do`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(toDoData),
  });

  toDoForm.reset();
});

function getTodoFromDB() {
  return fetch(`http://${ip}:${port}/to-do`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}
