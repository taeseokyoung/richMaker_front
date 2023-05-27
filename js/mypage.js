// /* conf.js로부터 base URL 불러오기 */
import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { getBookmarkInfo, getUserInfo } from "./api.js";

// function hadnleBtn() {
//   document.querySelector(".nav-drop-menu").classList.toggle("on");
//   document.querySelector(".menu_btn").classList.toggle("on");
// }


// 달력
let nowMonth = new Date();  // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date();     // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0);    // 비교 편의를 위해 today의 시간을 초기화

// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
function buildCalendar() {

  let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);     // 이번달 1일
  let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);  // 이번달 마지막날

  let tbody_Calendar = document.querySelector(".Calendar > tbody");
  document.getElementById("calYear").innerText = nowMonth.getFullYear();             // 연도 숫자 갱신
  document.getElementById("calMonth").innerText = leftPad(nowMonth.getMonth() + 1);  // 월 숫자 갱신

  while (tbody_Calendar.rows.length > 0) {                        // 이전 출력결과가 남아있는 경우 초기화
    tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
  }

  let nowRow = tbody_Calendar.insertRow();        // 첫번째 행 추가           

  for (let j = 0; j < firstDate.getDay(); j++) {  // 이번달 1일의 요일만큼
    let nowColumn = nowRow.insertCell();        // 열 추가
  }

  for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {   // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복  

    let nowColumn = nowRow.insertCell();        // 새 열을 추가하고
    nowColumn.innerText = leftPad(nowDay.getDate());      // 추가한 열에 날짜 입력


    if (nowDay.getDay() == 0) {                 // 일요일인 경우 글자색 빨강으로
      nowColumn.style.color = "#DC143C";
    }
    if (nowDay.getDay() == 6) {                 // 토요일인 경우 글자색 파랑으로 하고
      nowColumn.style.color = "#0000CD";
      nowRow = tbody_Calendar.insertRow();    // 새로운 행 추가
    }


    nowColumn.className = "Day";
    nowColumn.onclick = function () {
      choiceDate(this);
    }
  }

  // 날짜 선택
  function choiceDate(nowColumn) {
    if (document.getElementsByClassName("choiceDay")[0]) {                              // 기존에 선택한 날짜가 있으면
      document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");  // 해당 날짜의 "choiceDay" class 제거
    }
    nowColumn.classList.add("choiceDay"); // 선택된 날짜에 "choiceDay" class 추가
    Choicelist();
  }

  // 이전달 버튼 클릭
  function prevCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() - 1, nowMonth.getDate());   // 현재 달을 1 감소
    buildCalendar();    // 달력 다시 생성
  }
  // 다음달 버튼 클릭
  function nextCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, nowMonth.getDate());   // 현재 달을 1 증가
    buildCalendar();    // 달력 다시 생성
  }

  // input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
  function leftPad(value) {
    if (value < 10) {
      value = "0" + value;
      return value;
    }
    return value;
  }
}

// 선택한 날짜에 대한 정보 불러오기
async function Choicelist() {
  const year = document.getElementById("calYear").innerText
  const month = document.getElementById("calMonth").innerText
  const date = document.getElementsByClassName("choiceDay")[0].innerText
  const day = year + '-' + month + '-' + date

  // 선택한 날짜에 대한 지출 기록 불러오기
  const response_minus = await fetch(`${BACK_BASE_URL}/api/post/minus/${day}/`, {
    headers: {
      'content-type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    method: 'GET',
  })

  response_minus_json = await response_minus.json()
  //console.log(response_minus_json)

  const newbox = document.getElementById('minus-box-choice')
  newbox.setAttribute("style", "margin-top:10px;")

  if (response_minus_json != "") {
    newbox.innerText = "당신의 소비는?"
    response_minus_json.forEach(e => {
      const newdiv = document.createElement("div")
      newdiv.setAttribute("class", "minusinfo")
      const newP1 = document.createElement("span")
      newP1.setAttribute("style", "margin-right:20px;")
      newP1.innerText = "지출내역:  " + e["placename"]
      const newP2 = document.createElement("span")
      newP2.innerText = "지출금액:  " + e["totalminus"]
      newdiv.appendChild(newP1)
      newdiv.appendChild(newP2)
      newbox.appendChild(newdiv)
    })
  } else {
    newbox.innerText = "당신은 절약의 왕~!! 지출이 없습니다."
  }
  // 총 지출 금액
  all_minus = 0
  response_minus_json.forEach(e => {
    all_minus = all_minus + e["totalminus"]
  })
  const totalminussum = document.getElementById('total-minus-choice')
  totalminussum.innerText = "총 지출 금액:  " + all_minus

  // 선택한 날짜에 대한 저축 기록 불러오기
  const response_plus = await fetch(`${BACK_BASE_URL}/api/post/plus/${day}/`, {
    headers: {
      'content-type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    method: 'GET',
  })

  response_plus_json = await response_plus.json()
  console.log(response_plus_json)

  const newbox2 = document.getElementById('plus-box-choice')
  newbox2.setAttribute("style", "margin-top:10px;")

  if (response_plus_json != "") {
    newbox2.innerText = "당신의 저축은?"
    response_plus_json.forEach(e => {
      const newdiv = document.createElement("div")
      newdiv.setAttribute("class", "plusinfo")
      const newP1 = document.createElement("span")
      newP1.setAttribute("style", "margin-right:20px;")
      newP1.innerText = "챌린지명:  " + e["challenge_title"]
      const newP2 = document.createElement("span")
      newP2.setAttribute("style", "margin-right:20px;")
      newP2.innerText = "저축액:  " + e["plus_money"]
      newdiv.appendChild(newP1)
      newdiv.appendChild(newP2)
      newbox2.appendChild(newdiv)
    })
  } else {
    newbox2.innerText = "저축 좀 하고 삽시다!!!"
  }
  // 총 저축 금액
  all_plus = 0
  response_plus_json.forEach(e => {
    all_plus = all_plus + e["plus_money"]
  })
  const totalplussum = document.getElementById('total-plus-choice')
  totalplussum.innerText = "총 저축액:  " + all_plus

  // 선택한 날짜에 대한 수입 기록 불러오기
  const response_income = await fetch(`${BACK_BASE_URL}/api/post/income/${day}/`, {
    headers: {
      'content-type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    method: 'GET',
  })

  response_income_json = await response_income.json()
  //console.log(response_income_json)

  const newbox3 = document.getElementById('income-box-choice')
  newbox3.setAttribute("style", "margin-top:10px;")

  if (response_income_json != "") {
    newbox3.innerText = "당신의 수입은?"
    response_income_json.forEach(e => {
      const newdiv = document.createElement("div")
      newdiv.setAttribute("class", "incomeinfo")
      const newP1 = document.createElement("span")
      newP1.setAttribute("style", "margin-right:20px;")
      newP1.innerText = "수입:  " + e["income_money"]
      newdiv.appendChild(newP1)
      newbox3.appendChild(newdiv)
    })
  } else {
    newbox3.innerText = "마음이 아프니 아무 말도 하지 않겠어요..."
  }
  // 총 수입 금액
  all_income = 0
  response_income_json.forEach(e => {
    all_income = all_income + e["income_money"]
  })
  const totalincomesum = document.getElementById('total-income-choice')
  totalincomesum.innerText = "총 수입:  " + all_income

}


// 현재 날짜에 대한 기록 불러오기
async function gettoday() {
  const nowyear = today.getFullYear()
  const nowmonth = today.getMonth() + 1
  const nowdate = today.getDate()
  const nowday = nowyear + '-0' + nowmonth + '-' + nowdate

  // 현재 날짜에 대한 지출 기록 불러오기
  const response_minus = await fetch(`${BACK_BASE_URL}/api/post/minus/${nowday}/`, {
    headers: {
      'content-type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    method: 'GET',
  })

  minuslist = await response_minus.json()
  const newbox = document.getElementById('minus-box')

  minuslist.forEach(e => {
    const newdiv = document.createElement("div")
    newdiv.setAttribute("class", "minusinfo")
    const newP1 = document.createElement("span")
    newP1.setAttribute("style", "margin-right:20px;")
    newP1.innerText = "지출내역:  " + e["placename"]
    const newP2 = document.createElement("span")
    newP2.innerText = "지출금액:  " + e["totalminus"]
    newdiv.appendChild(newP1)
    newdiv.appendChild(newP2)
    newbox.appendChild(newdiv)
  })

  // 현재 날짜에 대한 총 지출 금액
  all_minus = 0
  minuslist.forEach(e => {
    all_minus = all_minus + e["totalminus"]
  })

  const totalminussum = document.getElementById('total-minus')
  totalminussum.innerText = "총 지출 금액:  " + all_minus

  // 현재 날짜에 대한 저축 기록 불러오기
  const response_plus = await fetch(`${BACK_BASE_URL}/api/post/plus/${nowday}/`, {
    headers: {
      'content-type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    method: 'GET',
  })

  pluslist = await response_plus.json()
  //console.log(pluslist)
  const newbox2 = document.getElementById('plus-box')

  pluslist.forEach(e => {
    const newdiv = document.createElement("div")
    newdiv.setAttribute("class", "plusinfo")
    const newP1 = document.createElement("span")
    newP1.setAttribute("style", "margin-right:20px;")
    newP1.innerText = "챌린지명:   " + e["challenge_title"]
    const newP2 = document.createElement("span")
    newP2.setAttribute("style", "margin-right:20px;")
    newP2.innerText = "저축액:   " + e["plus_money"]
    newdiv.appendChild(newP1)
    newdiv.appendChild(newP2)
    newbox2.appendChild(newdiv)
  })

  // 현재 저축에 대한 총금액
  all_plus = 0
  pluslist.forEach(e => {
    all_plus = all_plus + e["plus_money"]
  })

  const totalplussum = document.getElementById('total-plus')
  totalplussum.innerText = "총 저축액:  " + all_plus

  // 현재 날짜에 대한 수입 기록 불러오기
  const response_income = await fetch(`${BACK_BASE_URL}/api/post/income/${nowday}/`, {
    headers: {
      'content-type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    method: 'GET',
  })

  incomelist = await response_income.json()
  //console.log(incomelist)
  const newbox3 = document.getElementById('income-box')

  incomelist.forEach(e => {
    const newdiv = document.createElement("div")
    newdiv.setAttribute("class", "incomeinfo")
    const newP1 = document.createElement("span")
    newP1.setAttribute("style", "margin-right:20px;")
    newP1.innerText = "수입:   " + e["income_money"]
    newdiv.appendChild(newP1)
    newbox3.appendChild(newdiv)
  })

  // 현재 날짜에 대한 수입 총금액
  all_income = 0
  incomelist.forEach(e => {
    all_income = all_income + e["income_money"]
  })

  const totalincomesum = document.getElementById('total-income')
  totalincomesum.innerText = "총 수입:  " + all_income

}

// 수입 기록하기
async function handleIncome() {
  let token = localStorage.getItem("access")

  // date, income_money를 받는다.
  const date = await document.getElementById('date-income').value
  const income_money = await document.getElementById('income_money').value

  const request_income = await fetch(`${BACK_BASE_URL}/api/post/income/`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      "date": date,
      "income_money": income_money
    })
  })

  if (request_income.status == 200) {
    alert("작성 완료!")
    window.location.replace(`${FRONT_BASE_URL}/mypage.html`);
  } else {
    alert(request_income.status)
  }
}

// 수입 수정하기
async function handleIncomeUpdate() {
  let token = localStorage.getItem("access")

  // date, income_money를 받는다.
  const date = await document.getElementById('date-income2').value
  const income_money = await document.getElementById('income_money2').value


  const request_income = await fetch(`${BACK_BASE_URL}/api/post/income/${date}/`, {
    method: 'PUT',
    headers: {
      "Authorization": `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      "date": date,
      "income_money": income_money
    })
  })

  if (request_income.status == 200) {
    alert("수정 완료!")
    window.location.replace(`${FRONT_BASE_URL}/mypage.html`);
  } else {
    alert(request_income.status)
  }
}

// 수입 삭제하기
async function handleIncomeDelete() {
  let token = localStorage.getItem("access")

  // date, income_money를 받는다.
  const date = await document.getElementById('date-income3').value


  const request_income = await fetch(`${BACK_BASE_URL}/api/post/income/${date}/`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })

  if (request_income.status == 204) {
    alert("삭제 완료!")
    window.location.replace(`${FRONT_BASE_URL}/mypage.html`);
  } else {
    alert(request_income.status)
  }
}


//저축 기록하기
async function handleSaving() {
  let token = localStorage.getItem("access")

  // date, plus_money, challenge를 받는다.
  const date = document.getElementById('date-plus').value
  const plus_money = document.getElementById('plus_money').value
  const query = 'input[name="challenge"]:checked';
  const selectedEls = document.querySelectorAll(query)
  let challenge = 0

  selectedEls.forEach((el) => {
    challenge = parseInt(el.value)
  })

  const request_saving = await fetch(`${BACK_BASE_URL}/api/post/plus/`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      "date": date,
      "plus_money": plus_money,
      "challenge": challenge
    })
  })

  if (request_saving.status == 200) {
    alert("작성 완료!")
    window.location.replace(`${FRONT_BASE_URL}/mypage.html`);
  } else {
    alert(request_saving.status)
  }
}

//저축 수정하기
async function handleSavingUpdate() {
  let token = localStorage.getItem("access")

  // date, plus_money, challenge를 받는다.
  const date = document.getElementById('date-plus2').value
  const plus_money = document.getElementById('plus_money2').value
  const challenge = document.getElementById('challenge').value
  console.log(challenge)

  const request_saving = await fetch(`${BACK_BASE_URL}/api/post/plus/${challenge}/${date}/`, {
    method: 'PUT',
    headers: {
      "Authorization": `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      "date": date,
      "plus_money": plus_money,
      "challenge": challenge
    })
  })

  if (request_saving.status == 200) {
    alert("수정 완료!")
    window.location.replace(`${FRONT_BASE_URL}/mypage.html`);
  } else {
    alert(request_saving.status)
  }
}


//저축 삭제하기
async function handleSavingDelete() {
  let token = localStorage.getItem("access")

  // date, plus_money, challenge를 받는다.
  const date = document.getElementById('date-plus3').value
  const challenge = document.getElementById('challenge').value

  const request_saving = await fetch(`${BACK_BASE_URL}/api/post/plus/${challenge}/${date}/`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })

  if (request_saving.status == 204) {
    alert("삭제 완료!")
    window.location.replace(`${FRONT_BASE_URL}/mypage.html`);
  } else {
    alert(request_saving.status)
  }
}

async function bookmarkInfo(){
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload)

  const urlParams = new URLSearchParams(window.location.search);
  let searchID = urlParams.get('challenge_id');
  console.log(searchID)
  searchID = searchID == null ? payload_parse.challenge_id : searchID
  const response = await getBookmarkInfo(searchID)
  const response_json = await response.json()
  
  console.log(response_json)


  if (response.status == 200) { 
    // htmil의 id값을 가져아서 변수에 저장
    const challenge_title = document.getElementById("bookmark-title")
    const challenge_content = document.getElementById("bookmark-content")
    const main_image = document.getElementById("bookrmark-image")
    const amount = document.getElementById("bookmark-money")


    
        // 변수 안에 들어갈 텍스트를 응답값으로 변경
        challenge_title.innerText = response_json.challenge_title
        challenge_content.innerText = response_json.challenge_content
        amount.innerText = response_json.amount
  
        console.log(response_json.challenge_title)
        console.log(response_json.challenge_content)
        console.log(response_json.amount)
       
        // 이미지 값 변경이 있을때만 수정
        if (response_json.main_image != null) {
          main_image.setAttribute("src", `${BACK_BASE_URL}${response_json.main_image}`)
        }
          } else if (response.status == 404) {
                console.log("찾는 계정이 없습니다 ")
         } 
  // api.js(통신) 에서 응답값으로 데이터를 받아서  통신을 api.js로 옮겨야함 
  // fetch 로 백앤드와 통신하는 과정을 api.js로 옮기고
  // api.js 받아온 응답값을 다시  mypage.js로 가져와서
  // status코드값에 따라 데이터를 적절히 html에 넣어준다
  
          console.log(response_json.main_image)
}

// onlaod -> 순서를 마지막으로 보내줌 (* import가 있는 경우 중복 검증 때문에 하나만 있는게 좋음)
window.onload = async () => {
  bookmarkInfo();
  // hadnleBtn()
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload)

  const urlParams = new URLSearchParams(window.location.search);
  let searchID = urlParams.get('user_id');
  console.log(searchID)
  searchID = searchID == null ? payload_parse.user_id : searchID
  const response = await getUserInfo(searchID)
  const response_json = await response.json()
  
  console.log(response_json)

      // 성공했을때만 값을 변경함
  if (response.status == 200) { 
      // htmil의 id값을 가져아서 변수에 저장
      const email = document.getElementById("user-email")
      const username = document.getElementById("user-name") 
      const profile_image = document.getElementById("user-image")
      const bio = document.getElementById("user-bio")
      

      
        // 변수 안에 들어갈 텍스트를 응답값으로 변경
      email.innerText = response_json.email
      username.innerText = response_json.username
      bio.innerText = response_json.bio
     

      console.log(response_json.bio)
      console.log(response_json.username)
      console.log(response_json.email)
     
     
      // 이미지 값 변경이 있을때만 수정
      if (response_json.profile_image != null) {
        profile_image.setAttribute("src", `${BACK_BASE_URL}${response_json.profile_image}`)
      }
        } else if (response.status == 404) {
              console.log("찾는 계정이 없습니다 ")
       } 
// api.js(통신) 에서 응답값으로 데이터를 받아서  통신을 api.js로 옮겨야함 
// fetch 로 백앤드와 통신하는 과정을 api.js로 옮기고
// api.js 받아온 응답값을 다시  mypage.js로 가져와서
// status코드값에 따라 데이터를 적절히 html에 넣어준다

        console.log(response_json.profile_image)
  
        buildCalendar();

  gettoday();

  let token = localStorage.getItem("access")

  const response_challenge = await fetch(`${BACK_BASE_URL}/api/challenge/`, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  // 모달창 속 챌린지 checkbox 관련코드
  response_challenge_json = await response_challenge.json()
  //console.log(response_challenge_json)

  const challenges = document.getElementById("challenge-sort")
  const challenges2 = document.getElementById("challenge-sort2")
  const challenges3 = document.getElementById("challenge-sort3")

  response_challenge_json.forEach(challenge => {
    const newInput = document.createElement('input')
    newInput.setAttribute("style", "margin-right:15px;")
    newInput.setAttribute("type", "radio")
    newInput.setAttribute("name", "challenge")
    newInput.setAttribute("value", challenge['id'])
    newInput.setAttribute("id", 'challenge')

    const newInput2 = document.createElement('input')
    newInput2.setAttribute("style", "margin-right:15px;")
    newInput2.setAttribute("type", "radio")
    newInput2.setAttribute("name", "challenge")
    newInput2.setAttribute("value", challenge['id'])
    newInput2.setAttribute("id", 'challenge')

    const newInput3 = document.createElement('input')
    newInput3.setAttribute("style", "margin-right:15px;")
    newInput3.setAttribute("type", "radio")
    newInput3.setAttribute("name", "challenge")
    newInput3.setAttribute("value", challenge['id'])
    newInput3.setAttribute("id", 'challenge')

    const newChallenge = document.createElement('label')
    const newChallenge2 = document.createElement('label')
    const newChallenge3 = document.createElement('label')
    newChallenge.setAttribute("class", "challenge-input")
    newChallenge2.setAttribute("class", "challenge-input")
    newChallenge3.setAttribute("class", "challenge-input")
    newChallenge.innerText = challenge["challenge_title"]
    newChallenge2.innerText = challenge["challenge_title"]
    newChallenge3.innerText = challenge["challenge_title"]
    challenges.appendChild(newChallenge).appendChild(newInput)
    challenges2.appendChild(newChallenge2).appendChild(newInput2)
    challenges3.appendChild(newChallenge3).appendChild(newInput3)
  })
  }
