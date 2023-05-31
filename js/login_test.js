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