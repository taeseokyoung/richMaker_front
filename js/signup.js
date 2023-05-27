import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { signupAPI, EmailAuthenticationAPI, getAuthCodeAPI } from "./api.js";

document.getElementById("signUpButton").addEventListener("click", handleSignup);
document.getElementById("auth_button").addEventListener("click", EmailAuthentication);
document.getElementById("get_auth_code").addEventListener("click", getAuthCode);
document.getElementById("image").addEventListener("change", function (event) { readURL(event.target); });



id = ""
document.getElementById("아이디").addEventListener("clcik", function (event) { 함수이름(event.target); });


window.onload = async () => {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    // 로그인한 유저는 접근할 수 없음
    if (payload_parse != null) {
        window.location.replace(`${FRONT_BASE_URL}/index.html`);
    }
}


//  회원 가입
export async function handleSignup() {
    const response = await signupAPI()
    const response_json = await response.json()
    if (response.status == 200) {
        changeInputStyle()
        alert(response_json.message)
    } else if (response.status == 400) {
        alert("이미 가입된 이메일 계정이 있습니다.")
    } else {
        alert(response_json.message)
    }

}

// 인증코드 발급받으면 페이지 변화
export async function changeInputStyle() {
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const password2 = document.getElementById("password2")
    const username = document.getElementById("username")
    const bio = document.getElementById("bio")
    const profile_image = document.getElementById("image")
    const signUpButton = document.getElementById("signUpButton")
    const getAuthCode = document.getElementById("get_auth_code")

    email.readOnly = true
    password.readOnly = true
    password2.readOnly = true
    username.readOnly = true
    bio.readOnly = true
    profile_image.style.display = "none"
    signUpButton.style.display = "none"
    getAuthCode.style.display = "block"
}


//  이메일 인증을 통해 계정 활성화
export async function EmailAuthentication() {
    const response = await EmailAuthenticationAPI()
    const response_json = await response.json()
    if (response.status == 200) {
        alert(response_json.message)
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (response.status == 400 || response.status == 401) {
        alert(response_json.message)
    } else if (response.status == 404) {
        alert("등록된 이메일 정보가 없습니다.")
    }
}



//  이미지 파일 업로드시 이미지 미리보기 함수
export function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('preview').src = "";
    }
}


//  인증코드를 발급받지 못할 경우, 다시 인증코드 발급 받기
export async function getAuthCode() {
    const response = await getAuthCodeAPI()
    const response_json = await response.json()
    if (response.status == 200) {
        alert(response_json.message)
    } else {
        alert("회원 정보를 찾을 수 없습니다.")
    }
}