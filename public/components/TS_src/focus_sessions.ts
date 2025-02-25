const mainFocusSessions = document.querySelector(
  "#focus-session"
) as HTMLDivElement;
const mainPageforTS = document.querySelector("#main-page") as HTMLDivElement;

const sessionCount = mainFocusSessions.querySelector(
  ".session-complete-count"
) as HTMLDivElement;

const innerCircle = mainFocusSessions.querySelector(
  ".inner-focus-container"
) as HTMLDivElement;

//? buttons

const start_pauseFocusBtn = mainFocusSessions.querySelector(
  ".timer-play-pause-btn"
) as HTMLButtonElement;

const resetFocusBtn = mainFocusSessions.querySelector(
  ".timer-reset-btn"
) as HTMLButtonElement;

//? back button

const backBtn = mainFocusSessions.querySelector(
  ".fa-chevron-left"
) as HTMLButtonElement;

const configureSection = mainFocusSessions.querySelector(
  ".select-sessions-length"
) as HTMLDivElement;
const countDown = mainFocusSessions.querySelector(
  ".timer-countdown"
) as HTMLSpanElement;

const configureTimerBtn = mainFocusSessions.querySelector(
  "#adjust-time-btn"
) as HTMLDivElement;

const closeTimerConfig = mainFocusSessions.querySelector(
  ".close-timer-config"
) as HTMLButtonElement;

//? configure timer

const selectTimer = mainFocusSessions.querySelector(
  "#timer-selecter"
) as HTMLSelectElement;

let selectedTime: number = parseInt(selectTimer.value);

//? functions

const startTimer = (min: number): void => {
  innerCircle.style.animation = `
      0s linear 0s  normal none running `;
  innerCircle.style.animation = `
      ${min * 60}s linear 0s infinite normal none running rotate`;
};

const audio = new Audio("images/play_back.mp3");

selectTimer.addEventListener("input", () => {
  audio.pause();
  selectedTime = parseInt(selectTimer.value);
  countDown.innerHTML = selectedTime.toString();
  innerCircle.style.animation = `
  0s linear 0s  normal none running `;
  startTimer(selectedTime);
  dropDown();

  const intervalId = setInterval(() => {
    if (valueToChange <= 1) {
      innerCircle.style.animation = `
      0s linear 0s  normal none running `;
      countDown.innerHTML = "0";
      clearInterval(intervalId);
      afterFinish();
    } else {
      valueToChange--;
    }
  }, 60000);

  configureSection.classList.add("hidden");
});

let valueToChange: number = selectedTime;
let sessionCountValue: number = 0;

const dropDown = (): void => {
  const animationProp: string = getComputedStyle(innerCircle)
    .getPropertyValue("animation")
    .split(" ")[0];
  const numberCountValue: number = Number(animationProp.replace("s", "")) / 60;
  numberCountValue;
  valueToChange = numberCountValue;
};

sessionCount.innerHTML = sessionCountValue.toString();

const afterFinish = () => {
  audio.play();
  setTimeout(() => {
    audio.pause();
  }, 3000);
  sessionCount.innerHTML = (++sessionCountValue).toString();
};

start_pauseFocusBtn.addEventListener("click", () => {
  if (start_pauseFocusBtn.firstElementChild?.classList.contains("fa-play")) {
    start_pauseFocusBtn.firstElementChild?.classList.remove("fa-play");
    start_pauseFocusBtn.firstElementChild?.classList.add("fa-pause");
  } else if (
    start_pauseFocusBtn.firstElementChild?.classList.contains("fa-pause")
  ) {
    start_pauseFocusBtn.firstElementChild?.classList.remove("fa-pause");
    start_pauseFocusBtn.firstElementChild?.classList.add("fa-play");
  }
  innerCircle.style.animation = `
      0s linear 0s  normal none running `;
  startTimer(selectedTime);
  dropDown();
  audio.pause();
  countDown.innerHTML = selectedTime.toString();
  const intervalId = setInterval(() => {
    if (valueToChange <= 1) {
      innerCircle.style.animation = `
      0s linear 0s  normal none running `;
      countDown.innerHTML = "0";
      valueToChange = selectedTime;
      clearInterval(intervalId);
      afterFinish();
    } else {
      valueToChange--;
    }
  }, 60000);
  countDown.innerHTML = valueToChange.toString();
});

resetFocusBtn.addEventListener("click", () => {
  innerCircle.style.animation = `
      0s linear 0s  normal none running `;
  valueToChange = selectedTime;
  countDown.innerHTML = "0";
  audio.pause();

  const intervalId = setInterval(() => {}, 60000);
  clearInterval(intervalId);
});

configureTimerBtn.addEventListener("click", () => {
  configureSection.classList.toggle("hidden");
});

closeTimerConfig.addEventListener("click", () => {
  configureSection.classList.toggle("hidden");
});

backBtn.addEventListener("click", () => {
  mainFocusSessions.classList.add("hidden");
  mainPageforTS.classList.remove("hidden");
});
