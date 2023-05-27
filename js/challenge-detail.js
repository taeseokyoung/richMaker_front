import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { challengeLikeAPI, challengeBookmarkAPI } from "./api.js";




export async function payloadParse() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    return payload_parse
}


export async function getChallengeId() {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('challenge_id')
    return challengeId
}


// 챌린지 북마크 등록, 취소하기
document.getElementById("challengeBookmarkButton").addEventListener("click", challengeBookmark)
// // 챌린지 좋아요(관심) 등록, 취소하기
document.getElementById("challengeLikeButton").addEventListener("click", challengeLike)


// 해당 챌린지에 참여중인(북마크 등록한) 유저 리스트 뽑아오기
document.getElementById("showBookmarkingList").addEventListener("click", showBookmarkingList);
// 해당 챌린지에 관심등록(좋아요 누른) 유저 리스트 뽑아오기
document.getElementById("showLikingList").addEventListener("click", showLikingList);


export async function handleChallenge() {
    const challengeId = await getChallengeId()
    const response = await fetch(`${BACK_BASE_URL}/api/challenge/${challengeId}`,)

    const data = await response.json();
    document.querySelector('#main_image').setAttribute('src', `${BACK_BASE_URL}${data['main_image']}`)
    document.querySelector('#challenge_title').value = data.challenge_title
    document.querySelector('#period').value = data.period
    document.querySelector('#amount').value = data.amount
    document.querySelector('.note-editable p').innerHTML = data.challenge_content
}
handleChallenge()




// async function Challenge() {
//     const response = await getChallenge(challengeId)
//     console.log(response)
// }




//  사용자가 챌린지 좋아요 등록 및 취소
export async function challengeLike() {
    const challengeId = await getChallengeId()
    const response = await challengeLikeAPI(challengeId)
    try {
        const response_json = await response.json()
        console.log(response.status)
        if (response.status == 204) {
            // 챌린지 좋아요 취소
            console.log(response_json)
        } else if (response.status == 201) {
            // 챌린지 좋아요 등록
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


// 사용자가 챌린지 북마크 등록 및 취소
export async function challengeBookmark() {
    const challengeId = await getChallengeId()
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
//  챌린지 북마크 등록한 유저 리스트 뽑아오기
export async function showBookmarkingListAPI(user_id) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/bookmark/${user_id}/`)
    return response
}



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
