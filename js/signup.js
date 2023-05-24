import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { signupAPI, EmailAuthenticationAPI } from "./api.js";

document.getElementById("signUpButton").addEventListener("click", handleSignup);
document.getElementById("auth_button").addEventListener("click", EmailAuthentication);
document.getElementById("image").addEventListener("change", function (event) { readURL(event.target); });


window.onload = async () => {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    // 로그인한 유저는 접근할 수 없음
    if (payload_parse != null) {
        window.location.replace(`${FRONT_BASE_URL}/index.html`);
    }
}



export async function handleSignup() {
    const response = await signupAPI()
    const response_json = await response.json()
    if (response.status == 200) {
        changeInputStyle()
        alert(response_json.message)
    } else {
        alert(response_json.message)
    }

}

export async function changeInputStyle() {
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const password2 = document.getElementById("password2")
    const username = document.getElementById("username")
    const bio = document.getElementById("bio")
    const profile_image = document.getElementById("image")
    email.readOnly = true
    password.readOnly = true
    password2.readOnly = true
    username.readOnly = true
    bio.readOnly = true
    profile_image.style.display = "none"
}


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