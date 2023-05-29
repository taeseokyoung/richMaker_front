import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { LoginAPI } from "./api.js";
document.getElementById("login_button").addEventListener("click", handleLogin);

window.onload = async () => {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    // 로그인한 유저는 접근할 수 없음
    if (payload_parse != null) {
        window.location.replace(`${FRONT_BASE_URL}/index.html`);
    }

    // var element = document.getElementById("socialaccount_google");
    // var hrefValue = element.getAttribute("href");
    // element.setAttribute("href", `${BACK_BASE_URL}/accounts/google/login/`);
}



export async function handleLogin() {
    const response = await LoginAPI()
    if (response.status == 200) {
        const response_json = await response.json()

        // 토큰 저장
        localStorage.setItem("access", response_json.access)
        localStorage.setItem("refresh", response_json.refresh)

        // payload 저장
        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        localStorage.setItem("payload", jsonPayload)
        window.location.replace(`${FRONT_BASE_URL}/index.html`);
    } else {
        document.getElementById("password").value = ""
        alert("회원정보가 일치하지 않습니다.")
    }

}



// async function kakaoLoginBtn() {
//     const response = await fetch(`${backend_base_url}/api/users/kakao/`, { method: 'GET' })
//     const kakao_id = await response.json()
//     const redirect_uri = `${frontend_base_url}/index.html`
//     const scope = 'profile_nickname,profile_image,account_email,gender'
//     window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`
// }

async function googleLoginBtn() {
    console.log("google")
    const response = await fetch(`${backend_base_url}/api/users/google/`, { method: 'GET' })
    const google_id = await response.json()
    const redirect_uri = `${frontend_base_url}/index.html`
    const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    const param = `scope=${scope}&include_granted_scopes=true&response_type=token&state=pass-through value&prompt=consent&client_id=${google_id}&redirect_uri=${redirect_uri}`
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${param}`
}

// async function naverLoginBtn() {
//     const response = await fetch(`${backend_base_url}/api/users/naver/`, { method: 'GET' });
//     const naver_id = await response.json();
//     console.log(naver_id)
//     const redirect_uri = `${frontend_base_url}/index.html`;
//     const state = new Date().getTime().toString(36);
//     window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_id}&redirect_uri=${redirect_uri}&state=${state}`;
// }