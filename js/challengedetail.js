// import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { challengeLikeAPI, challengeBookmarkAPI } from "./api.js";
const BACK_BASE_URL = "http://127.0.0.1:8000";
const FRONT_BASE_URL = "http://127.0.0.1:5500";


const urlParams = new URLSearchParams(window.location.search);
const challengeId = urlParams.get('challenge_id')
let token = localStorage.getItem("access");
const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload)
let user_id = payload_parse.user_id

async function getChallenge() {
    const response = await fetch(`${BACK_BASE_URL}/api/challenge/${challengeId}/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();

    document.querySelector('#preview-image').setAttribute('src', `${BACK_BASE_URL}${data['main_image']}`)
    document.querySelector('#challenge_title').value = data.challenge_title
    document.querySelector('#period').value = data.period
    document.querySelector('#amount').value = data.amount
    document.querySelector('#exampleFormControlTextarea1').value = data.challenge_content
}
getChallenge()

async function getBookmark() {
    const response = await fetch(`${BACK_BASE_URL}/api/challenge/bookmark/`)
    console.log(response)
}
let bookmark = getBookmark()

console.log(bookmark)
// id user_id challenge_id

export async function showBookmarkingList() {
    const challengeId = await getChallengeId()
    const response = await showBookmarkingListAPI(challengeId)
    const response_json = await response.json()
    if (response.status == 200) {
        console.log(response_json)
    } else {
        console.log(response_json)
    }
}

document.getElementsById('btn-secondry').addEventListener('click',)



// document.getElementById('edit-btn').addEventListener('click', async function () {
//     if (data.id == challengeId) {
//         document.querySelector("input").removeAttribute('disabled readonly')
//     }

//     const challenge_title = document.getElementById("challenge_title").value;
//     const challenge_content = document.getElementById("exampleFormControlTextarea1").value;
//     const amount = document.getElementById("amount").value;
//     const period = document.getElementById("period").value;
//     const main_image = document.getElementById("main_image").files[0];
//     const formData = new FormData();

//     formData.append("challenge_title", challenge_title);
//     formData.append("challenge_content", challenge_content);
//     formData.append("amount", amount);
//     formData.append("period", period);
//     if (main_image) {
//         formData.append("main_image", main_image);
//     }

//     if (challenge_title && challenge_content) {
//         console.log(formData);
//         const response = await fetch(`${BACK_BASE_URL}/api/challenge/`, {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             body: formData,
//         });

//         if (response.status == 201) {
//             alert("게시글 작성완료");
//             window.location.replace(`${FRONT_BASE_URL}/challenge-post.html`);
//         } else {
//             const result = await response.json()
//             console.log(result)
//             alert("작성이 취소되었습니다");
//         }
//     } else {
//         console.log(response.json())
//         alert("빈칸을 작성하세요");
//     }
// })




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




// // 챌린지 북마크 등록, 취소하기
// document.getElementById("challengeBookmarkButton").addEventListener("click", challengeBookmark)


// 해당 챌린지에 관심등록(좋아요 누른) 유저 리스트 뽑아오기DCR5FV6

// document.getElementById("showLikingList").addEventListener("click", showLikingList);

// // // 챌린지 좋아요(관심) 등록, 취소하기
// document.getElementById("challengeLikeButton").addEventListener("click", challengeLike)



// async function Challenge() {
//     const response = await getChallenge(challengeId)
//     console.log(response)
// }



//  사용자가 챌린지 좋아요 등록 및 취소
export async function challengeLike() {

    const response = await challengeLikeAPI(challengeId)
    try {
        const response_json = await response.json()
        console.log(response.status)
        if (response.status == 204) {
            // 챌린지 좋아요 취소
            console.log(response_json)
        } else if (response.status == 201) {
            document.getElementById('like-btn').innerText('♡')
            console.log(response_json)
        } else {
            // 로그인 필요 또는 찾을 수 없는 챌린지
            console.log(response_json)
            const payload_parse = await payloadParse()
            if (payload_parse == null) {
                alert("로그인이 필요합니다.")
                window.location.replace(`${FRONT_BASE_URL}/login.html`);
            } else {
                alert("챌린지 게시글을 찾을 수 없습니다.")
                window.location.replace(`${FRONT_BASE_URL}/index.html`);
            }

        }
    } catch (error) {
        // 챌린지 좋아요 취소, 비동기 에러
        console.log("챌린지 좋아요 취소")
    }
}

document.getElementById('challenge-btn').addEventListener('click', challengeBookmark)

console.log("참가!")
// 사용자가 챌린지 북마크 등록 및 취소
export async function challengeBookmark() {
    const response = await challengeBookmarkAPI(challengeId)
    try {
        const response_json = await response.json()
        if (response.status == 204) {
            // 챌린지 북마크 취소
            console.log(response_json)
        } else if (response.status == 201) {
            // 챌린지 북마크 등록
            console.log(response_json)
        } else {
            // 로그인 필요 또는 찾을 수 없는 챌린지
            console.log(response_json)

            const payload_parse = await payloadParse()
            if (payload_parse == null) {
                alert("로그인이 필요합니다.")
                window.location.replace(`${FRONT_BASE_URL}/login.html`);
            } else {
                alert("챌린지 게시글을 찾을 수 없습니다.")
                window.location.replace(`${FRONT_BASE_URL}/index.html`);
            }

        }
    } catch (error) {
        // 챌린지 북마크 취소 비동기 에러
        console.log("북마크 등록 취소")
    }
}




//  챌린지 관심 등록한 유저 리스트 뽑아오기
export async function showLikingListAPI(user_id) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/likes/${user_id}/`)
    return response
}

export async function showLikingList() {
    const challengeId = await getChallengeId()
    const response = await showLikingListAPI(challengeId)
    const response_json = await response.json()
    if (response.status == 200) {
        console.log(response_json)
    } else {
        console.log(response_json)
    }

}