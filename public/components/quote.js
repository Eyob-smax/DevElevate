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

getElement("#back-quote", mainQuoteSection).addEventListener("click", () => {
  mainQuoteSection.classList.add("hidden");
  mainPage.classList.remove("hidden");
});

let arr = [];

const quoteContainer = getElement(".quote-cards-container", mainQuoteSection);
const quoteOption = getElement(".qoute-option", mainQuoteSection);
const previewBtn = getElement(".preview-btn", mainQuoteSection);
const favBtn = getElement(".quote-show-favs", mainQuoteSection);
const refreshBtn = getElement(".quote-refresh", mainQuoteSection);
const quotePreviewContainer = getElement(".quote-preview", mainQuoteSection);
const backPreviewBtn = getElement(".close-quote-preview", mainQuoteSection);

function createMainQuoteCard(author, quote) {
  const card = createElement(
    "div",
    "quote-card w-[90%] mx-auto mt-4 p-3 bg-[#F1EEFF] rounded-lg shadow-xl shadow-slate-900/5"
  );
  const quoteContent = createElement(
    "div",
    "quote-text text-center font-roboto text-[18px] py-2 px-4 rounded-lg shadow-xl shadow-slate-900/5"
  );
  const authorName = createElement(
    "h2",
    "author-name text-center pb-3",
    author
  );
  const quoteText = createElement(
    "p",
    "quote-text-content font-league max-h-[180px] overflow-scroll scrollbar",
    quote
  );

  const quoteBtnContainer = createElement(
    "div",
    "quote-btns mt-4 flex justify-between items-center"
  );
  const quoteFavBtn = createElement("button", "quote-fav-btn");
  const quoteFavBtnIcon = createElement(
    "i",
    "fas fa-heart text-[20px] text-[#8068FB]"
  );
  const quoteShareBtn = createElement("button", "quote-copy-btn");
  const quoteShareBtnIcon = createElement(
    "i",
    "fas fa-copy text-[20px] text-[#8068FB]"
  );

  quoteFavBtn.appendChild(quoteFavBtnIcon);
  quoteShareBtn.appendChild(quoteShareBtnIcon);
  quoteBtnContainer.appendChild(quoteFavBtn);
  quoteBtnContainer.appendChild(quoteShareBtn);

  quoteContent.appendChild(authorName);
  quoteContent.appendChild(quoteText);
  card.appendChild(quoteContent);
  card.appendChild(quoteBtnContainer);

  quoteShareBtn.addEventListener("click", () => {
    copyToClipboard(authorName, quoteText);
  });

  quoteFavBtn.addEventListener("click", () => {
    addToFav(author, quote);
  });
  return card;
}

let counter = 0;
let angle = 0;

function createPreviewCard(author, quote) {
  const card = createElement(
    "div",
    "preview-card absolute -translate-y-1/2 top-[45%] left-[50%] -translate-x-1/2 h-[250px] w-[75%] rounded-lg shadow-xl shadow-slate-900/5 ring-slate-200 ring-2  p-4  bg-[#F1EEFF]"
  );

  const authorName = createElement(
    "h2",
    "text-center text-pretty my-0 mb-4 font-bold text-[23px]",
    author
  );
  authorName.setAttribute("id", "author-name");
  const quoteContainer = createElement(
    "div",
    "quote-content max-h-[160px] overflow-y-scroll scrollbar"
  );
  const quoteText = createElement(
    "p",
    "quote-text font-league text-[18px] text-center",
    quote
  );

  quoteContainer.appendChild(quoteText);
  card.appendChild(authorName);
  card.appendChild(quoteContainer);

  card.addEventListener("click", async (e) => {
    counter++;
    if (counter >= 50) {
      toggleToMain();
      counter = 0;
      return;
    }
    card.classList.add("away");
    card.style.transform = "translateY(-120vh) rotate(-48deg)";
    card.style.transition = `rotate(${angle}deg)`;
    angle = angle - 20;
    card.style.transition = "0.5s ease-in-out";
  });
  return card;
}

async function fetchQuote() {
  try {
    const response = await fetch(`${DOMAIN}/quote`);
    const result = await response.json();
    arr.push(...result.data);
    arr.forEach((quote) => {
      const { a, q } = quote;
      const mainQuoteCard = createMainQuoteCard(a, q);
      quoteContainer.appendChild(mainQuoteCard);
    });
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", fetchQuote);

refreshBtn.addEventListener("click", () => {
  quoteContainer.innerHTML = "";
  fetchQuote();
});

previewBtn.addEventListener("click", () => {
  toggleToPreview();
  arr.forEach((quote) => {
    const { a, q } = quote;
    const previewCard = createPreviewCard(a, q);
    quotePreviewContainer.appendChild(previewCard);
  });
});

function toggleToPreview() {
  quoteContainer.classList.add("hidden");
  quoteOption.classList.add("hidden");
  quotePreviewContainer.classList.remove("hidden");
}

async function toggleToMain() {
  quoteContainer.classList.remove("hidden");
  quoteOption.classList.remove("hidden");
  quotePreviewContainer.classList.add("hidden");
}

backPreviewBtn.addEventListener("click", () => {
  arr.forEach((quote) => {
    const { a, q } = quote;
    const previewCard = createPreviewCard(a, q);
    quotePreviewContainer.removeChild(previewCard);
  });
  toggleToMain();
});

const cards = document.getElementsByClassName("preview-card");
console.log(cards);
const cardsArray = Array.from(cards);
const last = cardsArray.length - 1;
console.log(cardsArray.length);
function rotateCards() {
  let angle = 0;
  cardsArray.forEach((card, index) => {
    if (card.classList.contains("away")) {
      card.style.transform = `translateY(-120vh) rotate(-48deg)`;
    } else {
      card.style.transform = `translate(-50%, -50%) rotate(${angle}deg`;
      angle = angle - 5;
      card.style.zIndex = cardsArray.length - index;
      //   card.style.transform = "translate(-50%, -50%)";
    }
  });
}

cardsArray.forEach((card, index) => {
  card.style.transition = "0.5s ease-in-out";
  card.addEventListener("click", () => {
    card.classList.add("away");

    if (index === last) {
      cardsArray.forEach((each) => {
        each.classList.remove("away");
      });
    }
    rotateCards();
  });
});

function copyToClipboard(authorEl, quoteEl) {
  const author = authorEl.textContent;
  const quote = quoteEl.textContent;
  authorEl.select();
  quoteEl.select();
  authorEl.classList.add("copied");
  quoteEl.classList.add("copied");
  const text = `"${quote}" - ${author}`;
  navigator.clipboard.writeText(text);
}

function addToFav(author, quote) {
  const favQuote = { author, quote };
  const arrOfQuote = [];
  arrOfQuote.push(favQuote);
  loadToLocalStorage(arrOfQuote);
  const data = getFromLocalStorage();
  data.forEach((quote) => {
    const { author, quote } = quote;
    quoteContainer.innerHTML = "";
    const favCard = createMainQuoteCard(author, quote);
    quoteContainer.appendChild(favCard);
  });
}

function loadToLocalStorage(data) {
  const strigifyData = JSON.stringify(data);
  localStorage.setItem("favQuotes", strigifyData);
}

function getFromLocalStorage() {
  const data = localStorage.getItem("favQuotes");
  return JSON.parse(data);
}
