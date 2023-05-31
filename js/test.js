import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { LoginAPI } from "./api.js";
document.getElementById("kakao-login").addEventListener("click", kakaoLogin);


export async function kakaoLogin() {
    //  Client에게 API키 전달받기
    const response = await fetch(`${BACK_BASE_URL}/api/users/Kakao-login/`, { method: 'GET' })
    const kakao_id = await response.json()
    const redirect_uri = `${FRONT_BASE_URL}/test.html`
    const scope = 'profile_nickname,profile_image,account_email'
    // Resource Server로 우리의 Client와 Resource server간에 약속한 데이터 전달
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`
}


if (localStorage.getItem("payload")) {
} else if (location.href.split("=")[1]) {
    let code = new URLSearchParams(window.location.search).get("code");
    if (code) {
        getKakaoToken(code);
    }
}

async function setLocalStorage(response) {
    const response_json = await response.json();
    if (response.status === 200) {
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);
        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        localStorage.setItem("payload", jsonPayload)
        window.location.replace(`${FRONT_BASE_URL}/index.html`);
    } else {

        // window.history.back();
    }


}
// const payload = localStorage.getItem("payload");
//     const payload_parse = JSON.parse(payload)
// 각각 해당하는 url로 데이터를 실어서 요청을 보내고 액세스 토큰을 받아오는 함수
async function getKakaoToken(kakao_code) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/Kakao-login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: kakao_code })
    });
    setLocalStorage(response);
}
