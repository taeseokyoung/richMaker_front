/* conf.js로부터 base URL 불러오기 */
import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";

window.onload = () => {
  let token = localStorage.getItem("access")
  const urlParams = new URLSearchParams(window.location.search).get("query");
  const pageParams = new URLSearchParams(window.location.search).get("page");
  ChallengeList(urlParams, pageParams);
};

async function ChallengeList(query, page) {
  const queryOrder = query;
  const api =
    Number(page) === 0
      ? `${BACK_BASE_URL}/api/challenge/list?query=${queryOrder}`
      : `${BACK_BASE_URL}/api/challenge/list?page=${page}&query=${queryOrder}`;
  const response = await fetch(api, {
    method: "GET",
  });

  let queryPage = 0;

  if (Number(page) === 0) {
    let queryPage = 1;
  } else {
    let queryPage = Number(page);
  }

  const responseJson = await response.json();
  console.log(responseJson);
  console.log(queryPage);
  const challengeResults = responseJson.results;

  if (queryOrder === 'top') {
    document.querySelector('#challenge-category').innerHTML = '상위 챌린지 목록';
  } else if (queryOrder === 'new') {
    document.querySelector('#challenge-category').innerHTML = '신규 챌린지 목록';
  }

  const cardContainer = document.querySelector(".top-card-container");

  /* 게시글 삽입 */
  challengeResults.forEach((element) => {
    cardContainer.innerHTML += `<a class="challenge-check" href="/challengedetail.html?query=${element.id}">
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
  </a>`;
  });

  const pageCount = responseJson.count;
  const eachPage = responseJson.results.length;

  const previous_query = document.querySelector("#page-previous");
  const next_query = document.querySelector("#page-next");

  let paginationComponent = document.querySelector(".pagination");

  if (responseJson.links.previous !== null) {
    queryPage -= 1;
    const temp = document.createElement("li");
    temp.innerHTML = `<a class="page-link" onclick="ChallengeList('${queryOrder}', '${queryPage}')">Previous</a>`;
  }

  if (responseJson.links.next !== null) {
    queryPage += 1;
    const temp = document.createElement("li");
    temp.innerHTML = `<a class="page-link" onclick="ChallengeList('${queryOrder}', '${queryPage}')">Next</a>`;
    paginationComponent.append(temp);
  }
}
