const BACK_BASE_URL = "http://127.0.0.1:8000";
const FRONT_BASE_URL = "http://127.0.0.1:5500";

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("preview").src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);

  } else {
    document.getElementById("preview").src = "";
  }


}

const btnAiCheck = document.querySelector('#aiCheck');
btnAiCheck.addEventListener('click', async function (event) {
  const checkPreview = document.querySelector('#preview');

  const response = await fetch(`${BACK_BASE_URL}/api/post/ai/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      base64String: checkPreview.src
    })
  })

  responseJson = await response.json();
  responseJson = await JSON.parse(responseJson);
  console.log(responseJson);
  document.querySelector('.receipt-text').innerHTML = `
  <p>결제시간: <span id='aiYear'>${responseJson.payment_date.year}</span>년 <span id='aiMonth'>${responseJson.payment_date.month}</span>월 <span id='aiDay'>${responseJson.payment_date.day}</span>일 <span>${responseJson.payment_time.hour}:${responseJson.payment_time.minute}:${responseJson.payment_time.second}</span></p>
  <p>매장 이름: <span id='aiStoreName'>${responseJson.store_name.value}</span></p>
  <p>매장 주소: <span id='aiAddress'>${responseJson.address.value}</span></p>
  <p>수량: <span id='aiItemCount'>${responseJson.item_count.value}</span></p>
  <p>지출 금액 단가: <span id='aiTotalPrice'>${responseJson.total_price.value}</span>원</p>
  `

});

document.querySelector('#btnAiAdd').addEventListener('click', function (e) {
  const ai_placename2 = document.querySelector('#placename2')
  const ai_placewhere2 = document.querySelector('#placewhere2')
  const ai_amount2 = document.querySelector('#amount2')
  const ai_cost2 = document.querySelector('#cost2')


  ai_placename2.value = document.querySelector('#aiStoreName').textContent
  ai_placewhere2.value = document.querySelector('#aiAddress').textContent
  ai_amount2.value = document.querySelector('#aiItemCount').textContent
  ai_cost2.value = document.querySelector('#aiTotalPrice').textContent

  // 날짜 삽입하기
  const aiYear = document.querySelector('#aiYear').textContent
  const aiMonth = document.querySelector('#aiMonth').textContent
  const aiDay = document.querySelector('#aiDay').textContent

  nowMonth = new Date(aiYear, aiMonth - 1, aiDay);
  buildCalendar(diffDate = nowMonth);
  aiChoiceDate(aiDay)

})

function aiChoiceDate(aiDay) {
  if (document.getElementsByClassName("choiceDay")[0]) {                              // 기존에 선택한 날짜가 있으면
    document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");  // 해당 날짜의 "choiceDay" class 제거
  }
  document.querySelector(`#day${Number(aiDay)}`).classList.add("choiceDay");  // 선택된 날짜에 "choiceDay" class 추가
}