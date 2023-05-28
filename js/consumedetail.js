import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { Delete, getMinus } from "./api.js";
// const BACK_BASE_URL = "http://127.0.0.1:8000";
// const FRONT_BASE_URL = "http://127.0.0.1:5500";

// 달력
let nowMonth = new Date();  // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date();     // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0);    // 비교 편의를 위해 today의 시간을 초기화

// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
function buildCalendar(diffDate = null) {
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
    handleDetailget();
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


// 현재 날짜에 대한 기록 불러오기
async function gettoday() {
    const nowyear = today.getFullYear()
    const nowmonth = today.getMonth() + 1
    const nowdate = today.getDate()
    const nowday = nowyear + '-0' + nowmonth + '-' + nowdate

    const response_minus = await getMinus(nowday)
    const minuslist = await response_minus.json()

    const newbox = document.getElementById('minus-box')
    if (minuslist != "") {
        newbox.innerText = "   당신의 소비는? 지출 상세내역입니다."
        minuslist.forEach(e => {
            const minusid = e["id"]
            const newdiv = document.createElement("div")
            newdiv.setAttribute("class", "card")
            newdiv.setAttribute("style", "width:365px; border-radius:10px;")
            const newli = document.createElement("li")
            const newP1 = document.createElement("p")
            newP1.setAttribute("style", "margin-top:10px;")
            newP1.innerText = "매장이름:  " + e["placename"]
            const newP2 = document.createElement("p")
            newP2.setAttribute("style", "margin-top:10px;")
            newP2.innerText = "매장주소:  " + e["placewhere"]
            const newP3 = document.createElement("p")
            newP3.setAttribute("style", "margin-top:10px;")
            newP3.innerText = "수량:  " + e["amount"]
            const newP4 = document.createElement("p")
            newP4.setAttribute("style", "margin-top:10px;")
            newP4.innerText = "금액:  " + e["minus_money"]
            const newP5 = document.createElement("p")
            newP5.setAttribute("style", "margin-top:10px;")
            newP5.innerText = "총 금액:  " + e["totalminus"]
            const newP6 = document.createElement("p")
            newP6.setAttribute("style", "margin-top:10px;")
            newP6.innerText = "소비스타일:  " + e["stylename"]
            const newButton = document.createElement("button")
            newButton.innerHTML = "수정"
            newButton.setAttribute("id", `update_${minusid}`)
            newButton.setAttribute("value", `${minusid}`)
            newButton.addEventListener("click", function () {
                Minusupdate(minusid);
            })
            const newButton2 = document.createElement("button")
            newButton2.setAttribute("id", `delete_${minusid}`)
            newButton2.setAttribute("value", `${minusid}`)
            newButton2.innerHTML = "삭제"
            newButton2.addEventListener("click", function () {
                Minusdelete(minusid);
            })
            newli.appendChild(newP1)
            newli.appendChild(newP2)
            newli.appendChild(newP3)
            newli.appendChild(newP4)
            newli.appendChild(newP5)
            newli.appendChild(newP6)
            newli.appendChild(newButton)
            newli.appendChild(newButton2)
            newdiv.appendChild(newli)
            newbox.appendChild(newdiv)
        })
    } else {
        newbox.innerText = "오늘은 소비하지 않는 날~ :)"
    }


}

// 선택한 날짜의 소비 자세히보기
async function handleDetailget() {
    const year = document.getElementById("calYear").innerText
    const month = document.getElementById("calMonth").innerText
    const date = document.getElementsByClassName("choiceDay")[0].innerText
    const day = year + '-' + month + '-' + date

    const response_minus = await getMinus(day)
    //console.log(response_minus)

    const minuslist = await response_minus.json()
    console.log(minuslist)

    const newbox = document.getElementById('minus-box2')

    if (minuslist != "") {
        newbox.innerText = "   당신의 소비는? 지출 상세내역입니다."
        minuslist.forEach(e => {
            const minusid = e.id
            console.log(minusid)
            const newdiv = document.createElement("div")
            newdiv.setAttribute("class", "card")
            newdiv.setAttribute("style", "width:365px; border-radius:10px;")
            const newli = document.createElement("li")
            const newP1 = document.createElement("p")
            newP1.setAttribute("style", "margin-top:10px;")
            newP1.innerText = "매장이름:  " + e["placename"]
            const newP2 = document.createElement("p")
            newP2.setAttribute("style", "margin-top:10px;")
            newP2.innerText = "매장주소:  " + e["placewhere"]
            const newP3 = document.createElement("p")
            newP3.setAttribute("style", "margin-top:10px;")
            newP3.innerText = "수량:  " + e["amount"]
            const newP4 = document.createElement("p")
            newP4.setAttribute("style", "margin-top:10px;")
            newP4.innerText = "금액:  " + e["minus_money"]
            const newP5 = document.createElement("p")
            newP5.setAttribute("style", "margin-top:10px;")
            newP5.innerText = "총 금액:  " + e["totalminus"]
            const newP6 = document.createElement("p")
            newP6.setAttribute("style", "margin-top:10px;")
            newP6.innerText = "소비스타일:  " + e["stylename"]
            const newButton = document.createElement("button")
            newButton.innerHTML = "수정"
            newButton.setAttribute("id", `update_${minusid}`)
            newButton.setAttribute("value", `${minusid}`)
            newButton.addEventListener("click", function () {
                Minusupdate(minusid);
            })
            const newButton2 = document.createElement("button")
            newButton2.setAttribute("id", `delete_${minusid}`)
            newButton2.setAttribute("value", `${minusid}`)
            newButton2.innerHTML = "삭제"
            newButton2.addEventListener("click", function () {
                Minusdelete(minusid);
            })
            newli.appendChild(newP1)
            newli.appendChild(newP2)
            newli.appendChild(newP3)
            newli.appendChild(newP4)
            newli.appendChild(newP5)
            newli.appendChild(newP6)
            newli.appendChild(newButton)
            newli.appendChild(newButton2)
            newdiv.appendChild(newli)
            newbox.appendChild(newdiv)
        })
    } else {
        newbox.innerText = "   지출이 없습니다."
    }

}

// 수정하기
export async function Minusupdate(minusid) {
    window.location.href = `${FRONT_BASE_URL}/consumeedit.html?id=${minusid}`
}


// 삭제하기
export async function Minusdelete(minusid) {
    const request_minus = await Delete(minusid)

    if (request_minus.status == 204) {
        alert("삭제 완료!")
        window.location.replace(`${FRONT_BASE_URL}/consumedetail.html`);
    } else {
        alert(request_minus.status)
    }
}


// 마이페이지로 가기
document.getElementById("mypage").addEventListener("click", Mypage)
export async function Mypage() {
    window.location.href = `${FRONT_BASE_URL}/mypage.html`
}

window.onload = async function ConsumeDetail() {
    buildCalendar(); // 웹 페이지가 로드되면 buildCalendar 실행
    handleDetailget();
    gettoday();
}

