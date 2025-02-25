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
});

selectQuestionsBtn.addEventListener("click", () => {
  selectAiType.classList.add("hidden");
  questionSection.classList.remove("hidden");
  assistanceSection.classList.add("hidden");
});

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
    mainPage.classList.remove("hidden");
  });

const award = document.querySelector(".finish-questions");

const deleteAllBtn = document.querySelector(".delete-all");

deleteAllBtn.addEventListener("click", () => {
  mainAiQuetionSection.querySelector(".landing").classList.remove("hidden");
});

generateBtn.addEventListener("click", async () => {
  const data = {
    questionPrompt: `
  I want you to generate 5 questions about ${generateQuestion.value} for self-thought students studying web development. Each question should be relevant, and tailored to deepen understanding of the subject. 
  
  ### Formatting Criteria:
  1. **Each question should be numbered and follow this strict format:**
     **<Question Number>. <Question Text>**
     For example: 
     **1. What does the DOM stand for in web development?**
  
  2. **Answers should be listed in this precise format:**
     a) <Option A>
     b) <Option B>
     c) <Option C>
     d) <Option D>
  
  3. **Correct answers should follow this specific format:**
     **Correct Answer: <Answer Letter>**
     For example: 
     **Correct Answer: a)**
  
  4. **Do not include explanations or extra text, only the questions, answers, and correct answers in this strict order.**
  
  5. **Repeat this exact pattern for each question to ensure consistency.**
  
  ### Example Output:
  **1. What does the DOM stand for in web development?**
  a) Document Orientation Model  
  b) Document Object Model  
  c) Data Object Module  
  d) Data Orientation Model  
  
  **Correct Answer: b)**
  
  Ensure your output follows the above structure exactly to allow my program to process it effectively. Use the ${difficultyLevel.value} difficulty level to make the questions suitable for students. Never deviate from this format.
  and the another thing is the ${generateQuestion.value}(topic) random or non-sense you should generate random question aboout web dev`,
  };
  if (generateQuestion.value === "") {
    alert("Please enter a prompt");
    return;
  }

  loadingSpinner.classList.remove("hidden");
  setTimeout(() => {
    mainAiQuetionSection.querySelector(".landing").classList.add("hidden");
    loadingSpinner.classList.add("hidden");
  }, 5000);

  await fetch(`http://${ip}:${port}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  mainAiContainer.innerHTML = "";
  manipulateGeneratedData();
  generateQuestion.value = "";
});

deleteAllAssistance.addEventListener("click", () => {
  displayAssistance.innerHTML = "";
  mainAiQuetionSection
    .querySelector(".assistance-landing")
    .classList.remove("hidden");
});

generateAssistanceBtn.addEventListener("click", async () => {
  const assistanceData = {
    prompt: `Explain the concept of ${generateAssistance.value} in a explained and concise manner, focusing on is purpose, usage and examples. Include a practical example or use case to clarify the explanation. Use simple language and avoid technical jargon to ensure the explanation is easy to understand. the reponse should be specific to to web development, mobile development, or other technology-related domains. should not be very long !!not only these you should be flexible and able to adapt to the user's needs and provide the necessary information in a clear and concise manner.`,
  };
  if (generateAssistance.value === "") {
    alert("Please enter a prompt");
    return;
  }

  mainAiQuetionSection
    .querySelector(".loading-landing")
    .classList.remove("hidden");

  setTimeout(() => {
    mainAiQuetionSection
      .querySelector(".loading-landing")
      .classList.add("hidden");
    mainAiQuetionSection
      .querySelector(".assistance-landing")
      .classList.add("hidden");
  }, 6000);

  displayAssistance.firstChild?.remove();

  askedQuestion.innerHTML = generateAssistance.value;
  generateAssistance.value = "";
  await fetch(`http://${ip}:${port}/assistance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assistanceData),
  })
    .then((res) => console.log(res))
    .catch((err) => console.error(err));

  const fetchedAssistance = await getAssistanceData();

  const preElement = document.createElement("pre");
  preElement.style.whiteSpace = "pre-wrap";
  preElement.classList.add("text-[14px]");
  preElement.classList.add("font-roboto");
  preElement.classList.add("font-semibold");
  preElement.textContent = fetchedAssistance;
  displayAssistance.appendChild(preElement);
});

async function getAssistanceData() {
  return fetch(`http://${ip}:${port}/assistance`)
    .then((res) => res.json())
    .then((data) => {
      const fetchedAssistance =
        data?.response?.candidates[0]?.content?.parts[0]?.text;
      const final = fetchedAssistance
        .replaceAll("**", "")
        .replaceAll("``", "")
        .replaceAll("##", "");
      return final;
    });
}

function getDataFromGemini() {
  return fetch(`http://${ip}:${port}/generate`)
    .then((res) => res.json())
    .then((data) => {
      const fetchedQuestion =
        data?.response?.candidates[0]?.content?.parts[0]?.text;
      console.log(data.response.candidates[0].content.parts[0].text);
      return fetchedQuestion;
    });
}
let corrects = Math.floor(Math.random() * 150);

async function manipulateGeneratedData() {
  const fetched = await getDataFromGemini();
  console.log(fetched);
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
