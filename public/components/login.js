/* const loginTemplate = document.querySelector("#login-template").content;
const cloned = loginTemplate.cloneNode(true);
document.body.appendChild(cloned);
cloned.className = "flex-col items-center justify-center w-[80%] mx-auto" */

const firstPage = document.querySelector("#first-page");
const firstPageSignBtn = document.querySelector("#first-page-sign-btn");
const firstPageLogBtn = document.querySelector("#first-page-log-btn");
const cancelBtn = document.querySelector("#sign-cancel-btn");
const logSection = document.querySelector("#log-section");
const logCancelBtn = document.querySelector("#log-cancel-btn");
const signCancelBtn = document.querySelector("#sign-cancel-btn");
const signSection = document.querySelector("#sign-section");

const logBtn = document.querySelector("#log-btn");
const signBtn = document.querySelector("#sign-btn");

let userEmail = document.querySelector("#sign-email");
let userPass = document.querySelector("#sign-pass");
let userName = document.querySelector("#sign-user-name");
let confPass = document.querySelector("#sign-pass2");

const displayName = document.querySelector("#display-userName");

let sections = [logSection, firstPage, signSection, mainPage];

logBtn.addEventListener("click", checkLocalStorage);

logBtn.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkLocalStorage();
  }
});

function checkSign() {
  sections.forEach((section) => {
    section.classList.add("hidden");
  });
  mainPage.classList.remove("hidden");
}

logCancelBtn.addEventListener("click", () => {
  sections.forEach((section) => {
    section.classList.add("hidden");
  });
  firstPage.classList.remove("hidden");
});

firstPageSignBtn.addEventListener("click", () => {
  sections.forEach((section) => {
    section.classList.add("hidden");
  });
  signSection.classList.remove("hidden");
});

mainPage.querySelector(".fa-chevron-left").addEventListener("click", () => {
  sections.forEach((section) => {
    section.classList.add("hidden");
  });
  firstPage.classList.remove("hidden");
});

signCancelBtn.addEventListener("click", () => {
  sections.forEach((section) => {
    section.classList.add("hidden");
  });
  firstPage.classList.remove("hidden");
});

firstPageLogBtn.addEventListener("click", () => {
  sections.forEach((section) => {
    section.classList.add("hidden");
  });
  logSection.classList.remove("hidden");
});

let emailData = [];
let passData = [];
let nameData = [];
let confpassData = [];

function saveData() {
  signBtn.addEventListener("click", () => {
    if (userName !== "" && userPass !== "") {
      if (userPass.value === confPass.value) {
        if (userPass.value.length >= 8 && userEmail.value.includes("@")) {
          emailData.push(userEmail.value);
          nameData.push(userName.value);
          passData.push(userPass.value);
          confpassData.push(confPass.value);
          displayName.innerHTML = `Welcome, ${userName.value}`;

          saveTolocalstorage();
          checkSign();
          alert("Account created successfully");
        } else {
          alert(
            "Password must be at least 8 characters long or email must contain @"
          );
        }
      } else {
        alert("Passwords do not match");
      }
    } else {
      alert("Please fill in all the fields correctly");
    }
  });
}

saveData();

function saveTolocalstorage() {
  const uniqueEmail = new Set(emailData);
  const uniquePass = new Set(passData);
  const uniqueName = new Set(nameData);
  const uniqueConfPass = new Set(confpassData);

  localStorage.setItem("email", JSON.stringify([...uniqueEmail]));
  localStorage.setItem("pass", JSON.stringify([...uniquePass]));
  localStorage.setItem("name", JSON.stringify([...uniqueName]));
  localStorage.setItem("confPass", JSON.stringify([...uniqueConfPass]));
}

let getEmail = JSON.parse(localStorage.getItem("email"));
let getPass = JSON.parse(localStorage.getItem("pass"));
let getName = JSON.parse(localStorage.getItem("name"));
let getConfPass = JSON.parse(localStorage.getItem("confPass"));

console.log(getEmail, getPass, getName, getConfPass);

function checkLocalStorage(e) {
  const getLogName = document.querySelector("#log-user-name");
  const getLogPass = document.querySelector("#log-pass");
  const getName = JSON.parse(localStorage.getItem("name"));
  const getPass = JSON.parse(localStorage.getItem("pass"));

  if (getName && getPass) {
    if (
      getName.includes(getLogName.value) &&
      getPass.includes(getLogPass.value)
    ) {
      displayName.innerHTML = `Hi, ${getName.value}`;
      sections.forEach((section) => {
        section.classList.add("hidden");
      });
      mainPage.classList.remove("hidden");
    } else {
      alert("sorry");
    }
  }
}
