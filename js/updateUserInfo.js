import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { updatePassWordAPI, getAuthCodeAPI, passwordResetAPI } from "./api.js";

document.getElementById("get_auth_code_button").addEventListener("click", getAuthCode);

window.onload = async () => {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    console.log(payload_parse)


    if (payload_parse == null) {
        document.getElementById("update_user_info_button").addEventListener("click", passwordReset);

    } else {
        document.getElementById("update_user_info_button").addEventListener("click", updatePassWord);
        const email = document.getElementById("email")
        const get_auth_code_button = document.getElementById("get_auth_code_button")
        const auth_token_label = document.getElementById("auth_code_label")
        const auth_token = document.getElementById("auth_code")
        email.value = payload_parse.email
        email.readOnly = true
        get_auth_code_button.style.display = "none"
        auth_token_label.innerText = "기존 비밀번호"
        auth_token.placeholder = "기존 비밀번호를 입력해 주세요."
        auth_token.type = "password"
    }
}

//  회원 정보 수정(로그인 한 유저가 자신의 비밀번호를 재 설정 하고자 할 때)
export async function updatePassWord() {
    const password = document.getElementById("password").value
    const password2 = document.getElementById("password2").value
    if (password != password2) {
        alert("변경하고자 입력하신 두 비밀번호가 일치하지 않습니다.")
    } else {
        const response = await updatePassWordAPI()
        const response_json = await response.json()
        if (response.status == 200) {
            alert(`회원 정보를 수정 했습니다. 다시 로그인 해주세요.`)
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            localStorage.removeItem("payload")
            window.location.replace(`${FRONT_BASE_URL}/login.html`)
        } else {
            alert(response_json.message)
        }
    }
}

// 비밀번호 재 설정 (로그인 안한 유저가, 자신의 비밀번호를 재 설정 하고자 할 때)
export async function passwordReset() {
    const response = await passwordResetAPI()
    const response_json = await response.json()
    if (response.status == 200) {
        alert("요청하신 비밀번호로 변경되었습니다.")

        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else {
        console.log(response_json.message)
        if (response_json.message != null) {
            alert(response_json.message)
        } else {
            alert("회원 정보를 찾을 수 없습니다.")
        }
    }

}

//  인증 코드 발급
export async function getAuthCode() {
    const response = await getAuthCodeAPI()
    const response_json = await response.json()
    if (response.status == 200) {
        alert(response_json.message)
    } else {
        alert("회원 정보를 찾을 수 없습니다.")
    }
}

//  테스트 용도
export function logoutAPI() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.reload();
}

