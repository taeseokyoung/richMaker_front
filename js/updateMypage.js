import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { getUserInfo, updateUserProfileAPI } from "./api.js";
document.getElementById('updateUserProfileButton').addEventListener("click", updateUserProfile)
document.getElementById("image").addEventListener("change", function (event) { readURL(event.target); });

window.onload = async () => {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)

    if (payload_parse == null) {
        alert("로그인이 필요합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else {
        const response = await getUserInfo(payload_parse.user_id)
        const response_json = await response.json()
        if (response_json.profile_image == null) {
            document.getElementById('preview').src = "/img/richmaker-logo.png";
        } else {
            document.getElementById('preview').setAttribute("src", `${BACK_BASE_URL}${response_json.profile_image}`)
        }


        document.getElementById("email").value = response_json.email
        document.getElementById("username").value = response_json.username
        document.getElementById("bio").value = response_json.bio
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
        document.getElementById('preview').src = "/img/richmaker-logo.png";
    }
}

export async function updateUserProfile() {
    const response = await updateUserProfileAPI()
    const response_json = await response.json()

    if (response.status == 200) {
        alert(response_json.message)
        window.location.replace(`${FRONT_BASE_URL}/mypage.html`)
    } else {
        alert(response_json.message)
    }

}