/* conf.js로부터 base URL 불러오기 */
import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
//const BACK_BASE_URL = "http://127.0.0.1:8000";
//const FRONT_BASE_URL = "http://127.0.0.1:5500";


/* 페이지 로딩 */
window.onload = () => {
  handleListLoad();
};

/* 메인화면 List 불러오는 함수 */
async function handleListLoad() {
  const token = localStorage.getItem("access")
  let response;
  if (token === null) {
    response = await fetch(`${BACK_BASE_URL}/api/challenge/list`, {
      method: "GET"
    });
  } else {
    response = await fetch(`${BACK_BASE_URL}/api/challenge/list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
    }
    });
  }

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
    newChallengeList.innerHTML += `<a class="challenge-check" href="/challenge-detail.html?challenge_id=${element.id}">
                                      <div class="card">
                                        <div class="card-image-container">
                                          <img src=${BACK_BASE_URL}/${element.main_image}>
                                        </div>
                                        <div class="card-content-container">
                                          <h2>${element.challenge_title}</h2>
                                          <h3>목표: ${element.amount}만원</h3>
                                          <h3>${element.period}개월</h3>
                                          <div class="card-tags">
                                            <span>장기</span>
                                            <span>여행</span>
                                          </div>
                                        </div>
                                      </div>
                                    </a>`;
  });

  // Top Challenge
  const topChallenge = responseJson.top_challenge;
  const topChallengeListData = topChallenge.list;

  const topChallengeList = document.querySelector(".top-card-container");

  topChallengeListData.forEach((element) => {
    topChallengeList.innerHTML += `<a class="challenge-check" href="/challenge-detail.html?query=${element.id}">
                                    <div class="top-card">
                                      <div class="top-card-image-container">
                                        <img src=${BACK_BASE_URL}/${element.main_image}>
                                      </div>
                                      <div class="top-card-content-container">
                                        <h2>${element.challenge_title}</h2>
                                        <h3>목표: ${element.amount}만원</h3>
                                        <h3>${element.period}개월</h3>
                                        <div class="top-card-tags">
                                          <span>장기</span>
                                          <span>기타</span>
                                        </div>
                                      </div>
                                    </div>
                                  </a>
                                  `;                                  
  });
  document.querySelector('#idealIncome').textContent = Number(responseJson.ideal_expanse) / 10000
  document.querySelector('#remainingAmount').textContent = Number(responseJson.ideal_expanse) / 10000 - Number(responseJson.total_expanse) / 10000

  // Graph
  if (token === null) {
    document.querySelector('#report-title').innerHTML = '';
    document.querySelector('.graph-container').innerHTML = '<h1>로그인하시면 당신의 소비 경향을 분석할 수 있습니다.</h1>';
  } else {
    document.querySelector('#report-title').innerHTML = `리포트 <span>${responseJson.date}</span>`;
  const peopleJson = JSON.parse(responseJson.people)
  const individualJson = JSON.parse(responseJson.individual)
  if (individualJson === 0) {
    document.querySelector('.graph-container').innerHTML = '<h1>아직 이번 달 소비가 없어요! 등록해 주세요</h1>';
  } else {
    // CircleChart
    const circleChartElemet = document.getElementById('circleChart');
  
    new Chart(circleChartElemet, {
      type: 'pie',
      data: {
        labels: individualJson.consumer_style__style,
        datasets: [{
          label: '지출 금액',
          data: individualJson.all_amount,
          borderWidth: 3
        }]
      },
      options: {
      }
    });
  
    // radarChart
    const radarChartElement = document.getElementById('radarChart');
    const radarData = {
      labels: peopleJson.consumer_style__style,
      datasets: [{
        label: '일반적인 소비 성향',
        data: peopleJson.ratio,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }, {
        label: '당신의 소비 성향',
        data: individualJson.ratio,
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

  const announcement = {
    "사치품": "사치품: 돈 많으신가 봐요 👀",
    "음식": "음식: 지난 주에는 밥을 많이 드셨어요🍚",
    "취미": "취미: 건강한 취미 찾기!🤾‍♂️",
    "쇼핑": "쇼핑: 쇼핑을 하셨네요? 꼭.필.요.한.소.비.였.나.요?😁",
    "게임": "게임: 오..게임할 시간이 있다? ",
    "여행": "여행: 무리한 여행이 되지 않았기를",
    "운동": "운동: 건전한 취미예요!"
  }


  // report
  if (responseJson.report === 0) {
    document.querySelector('#report-data').innerHTML = `<h1>저번 주 소비가 없어요</h1>`
  } else {
    const reportParse = JSON.parse(responseJson.report)
    reportParse.consumer_style__style.forEach((e, i)=> {
      document.querySelector('#report-data').insertAdjacentHTML('beforeend', `<li>${announcement[e]} <span>지출금액: ${Math.ceil(Number(reportParse.all_amount[i]) / 10000) }만원</span></li>`)
    })
  }
  }


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
