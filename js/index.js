/* conf.js로부터 base URL 불러오기 */
// import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
const BACK_BASE_URL = "http://127.0.0.1:8000";
const FRONT_BASE_URL = "http://127.0.0.1:5500";

/* 페이지 로딩 */
window.onload = () => {
  handleListLoad();
};

/* 메인화면 List 불러오는 함수 */
async function handleListLoad() {
  const response = await fetch(`${BACK_BASE_URL}/api/challenge/list`, {
    method: "GET",
  });

  // IndexLoadData
  const responseJson = await response.json();

  // New Challenge
  const newChallenge = responseJson.new_challenge;
  const newChallengeCountData = newChallenge.count;
  const newChallengeListData = newChallenge.list;

  const newChallengeList = document.querySelector(".slider");
  const newChallengeCount = document.querySelector(".new-challenge-count");

  newChallengeCount.innerHTML = newChallengeCountData;

  newChallengeListData.forEach((element) => {
    newChallengeList.innerHTML += `<div class="card">
                                    <a href="/challenge-detail.html?query=${element.id}">
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
                                    </a>
                                  </div>`;
  });

  // Top Challenge
  const topChallenge = responseJson.top_challenge;
  const topChallengeListData = topChallenge.list;

  const topChallengeList = document.querySelector(".top-card-container");

  topChallengeListData.forEach((element) => {
    topChallengeList.innerHTML += `<div class="top-card">
                                    <a href="/challenge-detail.html?query=${element.id}">
                                      <div class="top-card-image-container">
                                        <img src="./fake-img/startup.png">
                                      </div>
                                      <div class="top-card-content-container">
                                        <h2>${element.challenge_title}</h2>
                                        <h3>목표: ${element.amount}만원</h3>
                                        <h3>${element.period}개월</h3>
                                        <div class="top-card-tags">
                                          <a href="">장기</a>
                                          <a href="">기타</a>
                                        </div>
                                      </div>
                                    </a>
                                  </div>
                                  `;                                  
  });

  // CircleChart
  const circleChartElemet = document.getElementById('circleChart');

  new Chart(circleChartElemet, {
    type: 'pie',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 3
      }]
    },
    options: {
    }
  });

  // radarChart
  const radarChartElement = document.getElementById('radarChart');
  const radarData = {
    labels: [
      'Eating',
      'Drinking',
      'Sleeping',
      'Designing',
      'Coding',
      'Cycling',
      'Running'
    ],
    datasets: [{
      label: '일반적인 소비 성향',
      data: [65, 59, 90, 81, 56, 55, 40],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }, {
      label: '당신의 소비 성향',
      data: [28, 48, 40, 19, 96, 27, 100],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }]
  }


  new Chart(radarChartElement, {
    type: 'radar',
    data: radarData,
    options: {
      line: {
        borderWidth: 3
      }
    }
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
