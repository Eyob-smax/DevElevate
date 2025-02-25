"use strict";
const mainFocusSessions = document.querySelector("#focus-session");
const mainPageforTS = document.querySelector("#main-page");
const sessionCount = mainFocusSessions.querySelector(".session-complete-count");
const innerCircle = mainFocusSessions.querySelector(".inner-focus-container");
const start_pauseFocusBtn = mainFocusSessions.querySelector(".timer-play-pause-btn");
const resetFocusBtn = mainFocusSessions.querySelector(".timer-reset-btn");
const backBtn = mainFocusSessions.querySelector(".fa-chevron-left");
const configureSection = mainFocusSessions.querySelector(".select-sessions-length");
const countDown = mainFocusSessions.querySelector(".timer-countdown");
const configureTimerBtn = mainFocusSessions.querySelector("#adjust-time-btn");
const closeTimerConfig = mainFocusSessions.querySelector(".close-timer-config");
const selectTimer = mainFocusSessions.querySelector("#timer-selecter");
let selectedTime = parseInt(selectTimer.value);
const startTimer = (min) => {
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
        }
        else {
            valueToChange--;
        }
    }, 60000);
    configureSection.classList.add("hidden");
});
let valueToChange = selectedTime;
let sessionCountValue = 0;
const dropDown = () => {
    const animationProp = getComputedStyle(innerCircle)
        .getPropertyValue("animation")
        .split(" ")[0];
    const numberCountValue = Number(animationProp.replace("s", "")) / 60;
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
    var _a, _b, _c, _d, _e, _f;
    if ((_a = start_pauseFocusBtn.firstElementChild) === null || _a === void 0 ? void 0 : _a.classList.contains("fa-play")) {
        (_b = start_pauseFocusBtn.firstElementChild) === null || _b === void 0 ? void 0 : _b.classList.remove("fa-play");
        (_c = start_pauseFocusBtn.firstElementChild) === null || _c === void 0 ? void 0 : _c.classList.add("fa-pause");
    }
    else if ((_d = start_pauseFocusBtn.firstElementChild) === null || _d === void 0 ? void 0 : _d.classList.contains("fa-pause")) {
        (_e = start_pauseFocusBtn.firstElementChild) === null || _e === void 0 ? void 0 : _e.classList.remove("fa-pause");
        (_f = start_pauseFocusBtn.firstElementChild) === null || _f === void 0 ? void 0 : _f.classList.add("fa-play");
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
        }
        else {
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
    const intervalId = setInterval(() => { }, 60000);
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
//# sourceMappingURL=focus_sessions.js.map