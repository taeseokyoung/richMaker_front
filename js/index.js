/* conf.js로부터 base URL 불러오기 */
import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";

/* 페이지 로딩 */
window.onload = () => {
  handleListLoad();
  document
    .querySelector(".menu_btn")
    .addEventListener("click", async function () {
      handleBtn();
    });
};

function handleBtn() {
  document.querySelector("nav").classList.toggle("on");
  document.querySelector(".menu_btn").classList.toggle("on");
}

/* 메인화면 List 불러오는 함수 */
async function handleListLoad() {
  const response = await fetch(`${BACK_BASE_URL}/api/challenge/list`, {
    method: "GET",
  });

  const responseJson = await response.json();

  const newChallenge = responseJson.new_challenge;
  const newChallengeCountData = newChallenge.count;
  const newChallengeListData = newChallenge.list;

  const newChallengeList = document.querySelector(".slider");
  const newChallengeCount = document.querySelector(".new-challenge-count");

  newChallengeCount.innerHTML = newChallengeCountData;

  newChallengeListData.forEach((element) => {
    newChallengeList.innerHTML += `<div class="card">
                                    <div class="card-image-container">
                                      <img src="./fake-img/paris.png">
                                    </div>
                                    <div class="card-content-container">
                                      <h2>${element.challenge_title}</h2>
                                      <h3>목표: ${element.amount}만원</h3>
                                      <h3>${element.period}개월</h3>
                                      <div class="card-tags">
                                        <a href="">장기</a>
                                        <a href="">여행</a>
                                      </div>
                                    </div>
                                  </div>`;
  });
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
