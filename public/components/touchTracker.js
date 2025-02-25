/* document.body.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
  },
  { passive: false }
); */

document.addEventListener("touchstart", (e) => {
  const toArr = Array.from(e.changedTouches);
  toArr.forEach((t) => {
    const created = document.createElement("div");
    created.classList.add("dot");
    created.style.top = `${t.pageY}px`;
    created.style.left = `${t.pageX}px`;
    created.id = t.identifier;
    document.body.append(created);
  });
});

document.addEventListener("touchmove", (e) => {
  const toArr = Array.from(e.changedTouches);
  toArr.forEach((dot) => {
    const dots = document.getElementById(dot.identifier);
    dots.style.top = `${dot.pageY}px`;
    dots.style.left = `${dot.pageX}px`;
  });
});

document.addEventListener("touchend", (e) => {
  const toArr = Array.from(e.changedTouches);
  toArr.forEach((dot) => {
    const dots = document.getElementById(dot.identifier);
    dots.remove();
  });
});
