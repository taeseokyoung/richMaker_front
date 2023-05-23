function handleBtn() {
  document.querySelector("nav").classList.toggle("on");
  document.querySelector(".menu_btn").classList.toggle("on");
}

/* Slider */
const next = document.querySelectorAll(".next");
const prev = document.querySelectorAll(".prev");
const slider = document.querySelectorAll(".slider");
for (let i = 0; i < slider.length; i++) {
  makeSlider(slider[i], prev[i], next[i]);
}
function makeSlider(element, prev, next) {
  next.addEventListener("click", () => {
    const offsetX = element.offsetWidth;
    element.scrollBy(offsetX, 0);
  });
  prev.addEventListener("click", () => {
    const offsetX = element.offsetWidth;
    element.scrollBy(-offsetX, 0);
  });
}
/* Slider end */
