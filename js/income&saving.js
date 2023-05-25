// 여기있는 것들은 mypage 완성되면, 그쪽 js로 옮겨서 연결할 것입니다.
// modal로 연결할 계획이나 추후 페이지로 구현될 수도 있습니다.

/* conf.js로부터 base URL 불러오기 */
//import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
const BACK_BASE_URL = "http://127.0.0.1:8000"
const FRONT_BASE_URL = "http://127.0.0.1:5500"

// 수입 기록하기
async function handleIncome() {
    let token = localStorage.getItem("access")

    // date, income_money를 받는다.
    const date = await document.getElementById('date').value
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
}

//저축 기록하기
async function handleSaving() {
    let token = localStorage.getItem("access")

    // date, plus_money, challenge를 받는다.
    // challenge는 북마크한 챌린지만 들고와서 목록을 보여주고, 그것 중 선택하는 것으로 하자.
    const date = await document.getElementById('date').value
    const plus_money = await document.getElementById('plus_money').value

    const query = 'input[name="challenge"]:checked';
    const selectedEls = document.querySelectorAll(query)
    const challenges = []
    selectedEls.forEach((el) => {
        challenges.push(parseInt(el.value))
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
            "challenge": challenges
        })
    })

    if (request_saving.status == 200) {
        alert("작성 완료!")
        window.location.replace(`${FRONT_BASE_URL}/index.html`);
    } else {
        alert(request_saving.status)
    }
}