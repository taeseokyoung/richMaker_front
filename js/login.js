import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { LoginAPI } from "./api.js";
document.getElementById("login_button").addEventListener("click", handleLogin);
// document.getElementById("googleLogin").addEventListener("click", googleLoginBtn);

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
        window.location.reload()
    } else {
        document.getElementById("password").value = ""
        alert("회원정보가 일치하지 않습니다.")
    }

}


