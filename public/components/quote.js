import { create } from "connect-mongo";

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

const arr = [];

const cards = document.querySelectorAll(".preview-card");
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

const quoteContainer = getElement(".quote-cards-container", mainQuoteSection);
const previewBtn = getElement(".preview-btn", mainQuoteSection);
const favBtn = getElement(".quote-show-favs", mainQuoteSection);
const refreshBtn = getElement(".quote-refresh", mainQuoteSection);
const quotePreviewContainer = getElement(".quote-preview", mainQuoteSection);

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
  return card;
}

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
  const backBtn = createElement(
    "button",
    "close-quote-preview rounded-full bg-[#F1EEFF] ring-[2px] ring-slate-600 text-white w-14 h-14 absolute bottom-[5%] -translate-x-1/2 -translate-y-1/2 left-[50%]"
  );
  const backBtnIcon = createElement(
    "i",
    "fas fa-times text-[20px] text-[#8068FB]"
  );

  backBtn.appendChild(backBtnIcon);
  quoteContainer.appendChild(quoteText);
  card.appendChild(authorName);
  card.appendChild(quoteContainer);

  card.appendChild(backBtn);
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
fetchQuote();
