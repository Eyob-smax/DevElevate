const difficultyLevel = mainAiQuetionSection.querySelector(
  "#difficulty-selector"
);

const selectAiType = mainAiQuetionSection.querySelector(".select-AI-type");

const selectAssistanceBtn = selectAiType.querySelector(".assistant");
const selectQuestionsBtn = selectAiType.querySelector(".question");

const assistanceSection = mainAiQuetionSection.querySelector(
  ".assistant-display-section"
);

const questionSection = mainAiQuetionSection.querySelector(
  ".question-display-section"
);

const displayAssistance = assistanceSection.querySelector(".coming-assistance");

const easyQuestion = document.querySelector("#easy-option");
const mediumQuestion = document.querySelector("#medium-option");
const hardQuestion = document.querySelector("#hard-option");

const generateAssistance = assistanceSection.querySelector(
  ".generate-assistance"
);

const deleteAllAssistance = assistanceSection.querySelector(
  ".delete-all-assistance"
);
const generateAssistanceBtn = assistanceSection.querySelector(
  ".generate-assistance-btn"
);

const askedQuestion = assistanceSection.querySelector(".question-asked");

const mainAiContainer = mainAiQuetionSection.querySelector(
  ".main-question-container"
);
const questionContainer = mainAiQuetionSection.querySelector(
  ".question-container"
);
const question = questionContainer.querySelector(".question");
const answerContainer = mainAiQuetionSection.querySelector(".answer-container");

const answers = answerContainer.querySelectorAll(".answer-btn");

const generateContenet =
  mainAiQuetionSection.querySelector(".generate-section");

const generateBtn = generateContenet.querySelector(".generate-btn");
const generateQuestion = generateContenet.querySelector(".generate-question");

const displayReview = mainAiQuetionSection.querySelector(".display-review");

const reviewSection = mainAiQuetionSection.querySelector(".show-scores");

const landing = mainAiQuetionSection.querySelector(".landing");

const assistanceLandingPage =
  assistanceSection.querySelector("assistance-landing");

selectAssistanceBtn.addEventListener("click", () => {
  selectAiType.classList.add("hidden");
  assistanceSection.classList.remove("hidden");
  questionSection.classList.add("hidden");
  displayReview.classList.add("hidden");
});

selectQuestionsBtn.addEventListener("click", () => {
  selectAiType.classList.add("hidden");
  questionSection.classList.remove("hidden");
  assistanceSection.classList.add("hidden");
  displayReview.classList.remove("hidden");
});
displayReview.classList.add("hidden");

const loadingSpinner = mainAiQuetionSection.querySelector(
  ".questions-loading-landing"
);
mainAiQuetionSection
  .querySelector(".fa-chevron-left")
  .addEventListener("click", () => {
    reviewSection.classList.add("hidden");
    mainAiQuetionSection.classList.add("hidden");
    assistanceSection.classList.add("hidden");
    questionSection.classList.add("hidden");
    selectAiType.classList.remove("hidden");
    displayReview.classList.add("hidden");
    mainPage.classList.remove("hidden");
  });

const award = document.querySelector(".finish-questions");

const deleteAllBtn = document.querySelector(".delete-all");

deleteAllBtn.addEventListener("click", () => {
  mainAiQuetionSection.querySelector(".landing").classList.remove("hidden");
  mainAiContainer.innerHTML = "";
  generateQuestion.value = "";
});

generateBtn.addEventListener("click", async () => {
  generateBtn.disabled = true;
  generateBtn.style.cursor = "not-allowed";
  generateBtn.style.backgroundColor = "#5f4dbb9c";
  try {
    mainAiQuetionSection.querySelector(".landing").classList.remove("hidden");
    loadingSpinner.classList.remove("hidden");
    const data = {
      prompt: generateQuestion.value,
      difficultyLevel: difficultyLevel.value,
    };
    if (generateQuestion.value === "") {
      generateBtn.disabled = false;
      generateBtn.style.cursor = "default";
      generateBtn.style.backgroundColor = "#8068FB";
      loadingSpinner.classList.add("hidden");
      if (
        mainAiQuetionSection
          .querySelector(".landing")
          .classList.contains("hidden")
      ) {
        mainAiQuetionSection
          .querySelector(".landing")
          .classList.remove("hidden");
      }
      return await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a prompt",
      });
    }

    await fetch(`http://${ip}:${port}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    mainAiContainer.innerHTML = "";
    manipulateGeneratedData();
  } catch (err) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
    generateBtn.disabled = false;
    generateBtn.style.cursor = "default";
    generateBtn.style.backgroundColor = "#8068FB";
  }
});

deleteAllAssistance.addEventListener("click", () => {
  displayAssistance.innerHTML = "";
  mainAiQuetionSection
    .querySelector(".assistance-landing")
    .classList.remove("hidden");
});

generateAssistanceBtn.addEventListener("click", async () => {
  generateAssistanceBtn.disabled = true;
  generateAssistanceBtn.style.cursor = "not-allowed";
  generateAssistanceBtn.style.backgroundColor = "#5f4dbb9c";
  mainAiQuetionSection
    .querySelector(".assistance-landing")
    .classList.remove("hidden");
  mainAiQuetionSection
    .querySelector(".loading-landing")
    .classList.remove("hidden");
  try {
    const assistanceData = {
      prompt: generateAssistance.value,
    };
    askedQuestion.style.textRendering = "optimizeLegibility";
    askedQuestion.innerHTML = generateAssistance.value;

    if (generateAssistance.value === "") {
      mainAiQuetionSection
        .querySelector(".loading-landing")
        .classList.add("hidden");
      generateAssistanceBtn.disabled = false;
      generateAssistanceBtn.style.cursor = "default";
      generateAssistanceBtn.style.backgroundColor = "#8068FB";
      return await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a prompt",
      });
    }

    const response = await fetch(`http://${ip}:${port}/assistance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assistanceData),
    });

    const data = await response.json();
    if (!data.success) {
      return await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.message,
      });
    }
    generateAssistance.style.textRendering = "optimizeLegibility";
    generateAssistance.value = "";
    const fetchedAssistance = await getAssistanceData();
    displayAssistance.firstChild?.remove();
    const preElement = document.createElement("pre");
    preElement.style.whiteSpace = "pre-wrap";
    preElement.classList.add("text-[14px]");
    preElement.classList.add("font-roboto");
    preElement.classList.add("font-semibold");
    preElement.textContent = fetchedAssistance;
    displayAssistance.appendChild(preElement);
  } catch (err) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.message,
    });
    generateBtn.disabled = false;
    generateBtn.style.cursor = "default";
    generateBtn.style.backgroundColor = "#8068FB";
    mainAiQuetionSection
      .querySelector(".assistance-landing")
      .classList.add("hidden");
    mainAiQuetionSection
      .querySelector(".loading-landing")
      .classList.remove("hidden");
  }
});

async function getAssistanceData() {
  generateAssistanceBtn.disabled = true;
  generateAssistanceBtn.style.cursor = "not-allowed";
  generateAssistanceBtn.style.backgroundColor = "#5f4dbb9c";
  mainAiQuetionSection
    .querySelector(".assistance-landing")
    .classList.remove("hidden");
  mainAiQuetionSection
    .querySelector(".loading-landing")
    .classList.remove("hidden");
  try {
    // loadingSpinner.classList.remove("hidden");
    const res = await fetch(`http://${ip}:${port}/assistance`);
    const data = await res.json();
    if (!data.success) {
      return await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.message,
      });
    }
    const fetchedAssistance =
      data.result?.response?.candidates[0]?.content?.parts[0]?.text;
    const final = fetchedAssistance
      .replaceAll("**", "")
      .replaceAll("``", "")
      .replaceAll("##", "");
    return final;
  } catch (err) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.message,
    });
    assistanceLandingPage.classList.add("hidden");
    loadingSpinner.classList.add("hidden");
  } finally {
    mainAiQuetionSection
      .querySelector(".loading-landing")
      .classList.add("hidden");
    mainAiQuetionSection
      .querySelector(".assistance-landing")
      .classList.add("hidden");
    loadingSpinner.classList.add("hidden");
    generateAssistanceBtn.disabled = false;
    generateAssistanceBtn.style.cursor = "default";
    generateAssistanceBtn.style.backgroundColor = "#8068FB";
  }
}

async function getDataFromGemini() {
  generateBtn.disabled = true;
  generateBtn.style.cursor = "not-allowed";
  generateBtn.style.backgroundColor = "#5f4dbb9c";
  try {
    const res = await fetch(`http://${ip}:${port}/generate`);
    const { success, results, message } = await res.json();
    if (!success) {
      return await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    }

    const fetchedQuestion =
      results?.response?.candidates[0]?.content?.parts[0]?.text;
    return fetchedQuestion;
  } catch (err) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.message,
    });

    return err.message;
  } finally {
    generateQuestion.value = "";
    mainAiContainer.innerHTML = "";
    generateBtn.disabled = false;
    generateBtn.style.cursor = "default";
    generateBtn.style.backgroundColor = "#8068FB";
    loadingSpinner.classList.add("hidden");
    mainAiQuetionSection.querySelector(".landing").classList.add("hidden");
  }
}
let corrects = Math.floor(Math.random() * 150);

async function manipulateGeneratedData() {
  const fetched = await getDataFromGemini();
  const questions = [...fetched.matchAll(/^\*\*\d+\.\s(.+?)\*\*/gm)].map(
    (match) => match[1]
  );
  const options = [...fetched.matchAll(/^[a-d]\)\s.+$/gm)].map(
    (match) => match[0]
  );
  const correctAnswers = [
    ...fetched.matchAll(/^\*\*Correct Answer:\s([a-d]\))\*\*$/gm),
  ].map((match) => match[1]);

  const chunkSize = 4;
  const chunkCount = 10;
  const separateArrays = [];

  for (let i = 0; i < chunkCount; i++) {
    separateArrays.push(options.slice(i * chunkSize, (i + 1) * chunkSize));
  }
  separateArrays.forEach((array, index) => {
    questions.forEach((question, i) => {
      if (index === i) {
        const templateArray = separateArrays.map((each, ind) => {
          if (ind === i && index === i && each !== ",") {
            return `<div
            class="question-answer-container bg-white p-2 mx-auto rounded-lg shadow-lg shadow-slate-900/5 ring-2 ring-black ring-opacity-10"
          >
            <div
              class="question-container border-b-[1px] break-words border-b-[#6350bf] py-1"
            >
              <h2 class="font-roboto font-semibold text-[#8068FB] pb-2">
                Question
              </h2>
              <p
                class="font-roboto font-semibold text-[14px] tracking-wide max-h-[200px] overflow-y-scroll scrollbar justify-last-center"
              >
                <span id="current-question-no"> ${i + 1}. </span>
                ${question}
              </p>
            </div>
            <div
              class="answer-container w-full bg-[#f1f1f1] rounded-lg p-1  mt-1  max-h-[250px] overflow-y-scroll scrollbar"
            >
              <button
              id="a"
              onclick="(() => {
                const answer = this.dataset.answer;
                const correctAnswer = '${correctAnswers[i]}';
                console.log(answer, correctAnswer);
                
                answer === correctAnswer ? this.classList.toggle('bg-green-300') : this.classList.toggle('bg-red-300');
              })()"
              data-answer="a)"
                class="ml-2 text-[13px] answer-btn text-center bg-white shadow-xl shadow-slate-600/5 ring-2 ring-slate-200 w-[95%] mx-auto rounded-xl focus:border-2 py-2 break-words px-2 focus:border-[#6350bf] focus:border-opacity-50 mt-2"
              >
                ${each[0]}
              </button>
              <button
              data-answer="b)"
              onclick="(() => {
                const answer = this.dataset.answer;
                const correctAnswer = '${correctAnswers[i]}';
                console.log(answer, correctAnswer);
                
                answer === correctAnswer ? this.classList.toggle('bg-green-300') : this.classList.toggle('bg-red-300');
              })()"
                class="ml-2 text-[13px] answer-btn text-center bg-white shadow-xl shadow-slate-600/5 ring-2 ring-slate-200 w-[95%] mx-auto rounded-xl px-2 py-2 break-words focus:border-2 focus:border-[#6350bf] focus:border-opacity-50 mt-2 "
              >
              ${each[1]}
              </button>
              <button
              id="c"
              data-answer="c)" 
                onclick="(() => {
                const answer = this.dataset.answer;
                const correctAnswer = '${correctAnswers[i]}';
                console.log(answer, correctAnswer);
                
                answer === correctAnswer ? this.classList.toggle('bg-green-300') : this.classList.toggle('bg-red-300');
              })()"
                class="ml-2 text-[13px] answer-btn text-center bg-white shadow-xl shadow-slate-600/5 ring-2 ring-slate-200 w-[95%] mx-auto rounded-xl px-2 py-2 break-words focus:border-2 focus:border-[#6350bf] focus:border-opacity-50 mt-2"
              >
              ${each[2]}
              </button>
              <button
              data-answer="d)"
              onclick="(() => {
                const answer = this.dataset.answer;
                const correctAnswer = '${correctAnswers[i]}';
                console.log(answer, correctAnswer);
                
                answer === correctAnswer ? this.classList.toggle('bg-green-300') : this.classList.toggle('bg-red-300');
              })()"
                class="px-2 ml-2 text-[13px] answer-btn text-center bg-white shadow-xl shadow-slate-600/5 ring-2 ring-slate-200 w-[95%] mx-auto rounded-xl py-2 break-words focus:border-2 focus:border-[#6350bf] focus:border-opacity-50 mt-2"
              >
              ${each[3]}
              </button>
            </div>
          </div>`;
          }
        });
        reviewSection.innerHTML = `<P>${corrects}</P>`;
        mainAiContainer.insertAdjacentHTML(
          "beforeend",
          templateArray.join(",")
        );
        award.addEventListener("click", () => {
          reviewSection.classList.toggle("hidden");
        });
        corrects > 100
          ? (reviewSection.innerHTML = `<P>${corrects}<span>😃</span></P>`)
          : (reviewSection.innerHTML = `<P>${corrects}<span>😑</span></P>`);
      }
    });
  });
}
