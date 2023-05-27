import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { getUserInfo } from "./api.js";

window.onload = async () => {
    getUserProfile()

}

// 프로필 정보 읽어오기
export async function getUserProfile() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)

    const urlParams = new URLSearchParams(window.location.search);
    let searchID = urlParams.get('user_id');
    searchID = searchID == null ? payload_parse.user_id : searchID

    const response = await getUserInfo(searchID)

    const response_json = await response.json()
    console.log(response_json)

    

    // 성공했을때만 값을 변경함
    if (response.status == 200) {
        // htmil의 id값을 가져아서 변수에 저장
        const email = document.getElementById("user-email")
        const username = document.getElementById("user-name")
        const profile_image = document.getElementById("user-image")
        const bio = document.getElementById("user-bio")
        const bookmark = document.getElementById("bookmark-title")

        // 변수 안에 들어갈 텍스트를 응답값으로 변경
        email.innerText = response_json.email
        username.innerText = response_json.username
        bio.innerText = response_json.bio
        bookmark.innerText = response_json.bookmark


        // 이미지 값 변경이 있을때만 수정
        if (response_json.profile_image != null) {
            profile_image.setAttribute("src", `${BACK_BASE_URL}${response_json.profile_image}`)
        }
    } else if (response.status == 404) {
        console.log("찾는 계정이 없습니다 ")
    }
}