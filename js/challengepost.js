import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";





//user_id
export async function getPayloadParse() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    return payload_parse
}

// 챌린지 id 불러오기
export async function getChallengeId() {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('challenge_id')
    return challengeId
}


document.getElementById('press-btn').addEventListener('click', async function () {
    const token = localStorage.getItem("access");
    console.log(token)
    console.log("클릭")
    const challenge_title = document.getElementById("challenge_title").value;
    const challenge_content = document.getElementById("exampleFormControlTextarea1").value;
    const amount = document.getElementById("amount").value;
    const period = document.getElementById("period").value;
    const main_image = document.getElementById("main_image").files[0];

    const formData = new FormData();
    // console.log(challenge_title.value)
    formData.append("challenge_title", challenge_title);
    formData.append("challenge_content", challenge_content);
    formData.append("amount", amount);
    formData.append("period", period);
    formData.append("main_image", main_image);

    if (challenge_title && challenge_content) {
        console.log(formData);
        const response = await fetch('http://127.0.0.1:8000/api/challenge/', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.status == 201) {
            alert("챌린지 작성완료");
            window.location.replace(`${FRONT_BASE_URL}/list.html`);
        } else {
            const result = await response.json()
            console.log(result)
            alert("챌린지 작성이 취소되었습니다");
        }
    } else {
        console.log(response.json())
        alert("빈칸을 작성하세요");
    }
})

// 이미지 미리보기
document.getElementById('main_image').addEventListener('change', function () {
    readURL(this)
})
function readURL(input) {
    console.log("이미지 입력!")
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview-image').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('preview-image').src = "";
    }
}