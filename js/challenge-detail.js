// import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
const BACK_BASE_URL = "http://127.0.0.1:8000";
const FRONT_BASE_URL = "http://127.0.0.1:5500";

handleChallenge()

async function handleChallenge() {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('challenge_id')

    const response = await fetch(`${BACK_BASE_URL}/api/challenge/${challengeId}`,)

    const data = await response.json();
    document.querySelector('#main_image').setAttribute('src', `${BACK_BASE_URL}${data['main_image']}`)
    document.querySelector('#challenge_title').value = data.challenge_title
    document.querySelector('#period').value = data.period
    document.querySelector('#amount').value = data.amount
    document.querySelector('.note-editable p').innerHTML = data.challenge_content
    console.log(data)
}




// async function Challenge() {
//     const response = await getChallenge(challengeId)
//     console.log(response)
// }




// 챌린지 북마크 등록, 취소하기
// document.getElementById("bookmark_button").addEventListener("click", handleSignup);
// // 챌린지 좋아요(관심) 등록, 취소하기
// document.getElementById("like_button").addEventListener("click", EmailAuthentication);

// // 해당 챌린지에 참여중인(북마크 등록한) 유저 리스트 뽑아오기
// document.getElementById("show_bookmarkingList_button").addEventListener("click", handleSignup);
// // 해당 챌린지에 관심등록(좋아요 누른) 유저 리스트 뽑아오기
// document.getElementById("show_likeingList_button").addEventListener("click", EmailAuthentication);



// 사용자가 챌린지 좋아요 등록 및 취소
async function challengeLikeAPI(challenge_id) {
    const access_token = localStorage.getItem("access")
    const response = await fetch(`${BACK_BASE_URL}/api/users/likes/${user_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'POST',
    })
    return response
}
async function challengeLike() {

    const urlParams = new URLSearchParams(window.location.search);
    let challenge_id = urlParams.get('challenge_id');
    console.log(challenge_id)

    // const response = await challengeLikeAPI(challenge_id)
    // const response_json = await response.json()
    // if (response.status == 204) {
    //     // 챌린지 좋아요 취소
    // } else if (response.status == 201) {
    //     // 챌린지 좋아요 등록
    // }else{
    //     // 로그인 필요 또는 찾을 수 없는 챌린지
    // }
}



// export async function challengeBookmarkAPI(user_id) {
//     const access_token = localStorage.getItem("access")
//     const response = await fetch(`${BACK_BASE_URL}/api/users/bookmark/${user_id}/`, {
//         headers: {
//             'content-type': 'application/json',
//             "Authorization": `Bearer ${access_token}`,
//         },
//         method: 'POST',
//     })
//     return response
// }



// //  챌린지 관심 등록한 유저 리스트 뽑아오기
// export async function showLikingListAPI(user_id) {
//     const response = await fetch(`${BACK_BASE_URL}/api/users/likes/${user_id}/`)
//     return response

// }
// //  챌린지 북마크 등록한 유저 리스트 뽑아오기
// export async function showBookmarkingListAPI(user_id) {
//     const response = await fetch(`${BACK_BASE_URL}/api/users/bookmark/${user_id}/`)
//     return response
// }

