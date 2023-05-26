//import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
const BACK_BASE_URL = "http://127.0.0.1:8000";
const FRONT_BASE_URL = "http://127.0.0.1:5500";

window.onload = async function Consume() {
    buildCalendar(); // 웹 페이지가 로드되면 buildCalendar 실행

    // 소비경향
    const response_style = await fetch(`${BACK_BASE_URL}/api/post/style/`, {
        method: 'GET'
    });

    response_style_json = await response_style.json()
    // console.log(response_style_json)
    const styles = document.getElementById("consume-style")
    response_style_json.forEach(style => {
        const newInput = document.createElement('input')
        newInput.setAttribute("type", "radio")
        newInput.setAttribute("name", "style")
        newInput.setAttribute("value", style['id'])
        newInput.setAttribute("id", "style")
        const newStyle = document.createElement('label')
        newStyle.setAttribute("class", "style-input")
        newStyle.innerText = style['style']
        styles.appendChild(newStyle).appendChild(newInput)
    })

    // 소비내역
    const placeName = document.getElementById("placename")
    const newName = document.createElement('input')
    newName.setAttribute("type", "text")
    newName.setAttribute("id", "placename2")
    placeName.appendChild(newName)

    const placeWhere = document.getElementById("placewhere")
    const newPlace = document.createElement('input')
    newPlace.setAttribute("type", "text")
    newPlace.setAttribute("id", "placewhere2")
    placeWhere.appendChild(newPlace)

    const Amount = document.getElementById("amount")
    const newAmount = document.createElement('input')
    newAmount.setAttribute("type", "text")
    newAmount.setAttribute("id", "amount2")
    Amount.appendChild(newAmount)

    const Cost = document.getElementById("cost")
    const newCost = document.createElement('input')
    newCost.setAttribute("type", "text")
    newCost.setAttribute("id", "cost2")
    Cost.appendChild(newCost)
}

// 달력
let nowMonth = new Date();  // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date();     // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0);    // 비교 편의를 위해 today의 시간을 초기화

// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
function buildCalendar(diffDate=null) {
    // 매개변수가 있으면 nowMonth를 diffDate로 바꿔줌
    if (diffDate !== null) {
        nowMonth = diffDate;
    }
    let count = 1
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


        //if (nowDay < today) {                       // 지난날인 경우
        //    nowColumn.className = "pastDay";
        //    nowColumn.onclick = function () { choiceDate(this); }
        //}
        //else if (nowDay.getFullYear() == today.getFullYear() && nowDay.getMonth() == today.getMonth() && nowDay.getDate() == today.getDate()) { // 오늘인 경우           
        //    nowColumn.className = "today";
        //    nowColumn.onclick = function () { choiceDate(this); }
        //}
        //else {                                      // 미래인 경우
        //    nowColumn.className = "futureDay";
        //    nowColumn.onclick = function () { choiceDate(this); }
        //}

        nowColumn.className = "Day";
        nowColumn.id = `day${count}`
        count += 1

        nowColumn.onclick = function () { choiceDate(this); }
    }
}

// 날짜 선택
function choiceDate(nowColumn) {
    if (document.getElementsByClassName("choiceDay")[0]) {                              // 기존에 선택한 날짜가 있으면
        document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");  // 해당 날짜의 "choiceDay" class 제거
    }
    nowColumn.classList.add("choiceDay");  // 선택된 날짜에 "choiceDay" class 추가
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


// 소비기록하기
async function handlePost() {
    let token = localStorage.getItem("access")
    const year = document.getElementById("calYear").innerText
    const month = document.getElementById("calMonth").innerText
    const date = document.getElementsByClassName("choiceDay")[0].innerText
    const day = year + '-' + month + '-' + date


    const placeName = await document.getElementById('placename2').value
    const placeWhere = await document.getElementById('placewhere2').value
    const Amount = await document.getElementById('amount2').value
    const Cost = await document.getElementById('cost2').value

    const query = 'input[name="style"]:checked';
    const selectedEls = document.querySelectorAll(query)
    let Style = 0

    selectedEls.forEach((el) => {
        Style = parseInt(el.value)
    })
    const request_post = await fetch(`${BACK_BASE_URL}/api/post/minus/`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "date": day,
            "minus_money": Cost,
            "placename": placeName,
            "placewhere": placeWhere,
            "amount": Amount,
            "consumer_style": Style //1
        })
    })

    if (request_post.status == 200) {
        alert("작성 완료!")
        window.location.replace(`${FRONT_BASE_URL}/mypage.html`);
    } else {
        alert(request_post.status)
    }
}