import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { challengeLikeAPI, challengeBookmarkAPI, updateCommentAPI, deleteCommentAPI, showCommentListAPI, writeComment } from "./api.js";




export async function getPayloadParse() {
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
        if (response.status == 204) {
            // 챌린지 좋아요 취소
            console.log(response_json)
        } else if (response.status == 201) {
            // 챌린지 좋아요 등록
            console.log(response_json)
        } else {
            // 로그인 필요 또는 찾을 수 없는 챌린지
            console.log(response_json)
            const payload_parse = await getPayloadParse()
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

            const payload_parse = await getPayloadParse()
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









// 댓글 리스트 조회
export async function showCommentList() {
    const ChallengeId = await getChallengeId()
    const response = await showCommentListAPI(ChallengeId)
    const response_json = await response.json()

    const commentList = document.getElementById("commentList")
    const payloadParse = await getPayloadParse()
    response_json.forEach(element => {
        const owner_image = element.owner_image == null ? './img/richmaker-logo.png' : `${BACK_BASE_URL}${element.owner_image}`
        commentList.innerHTML += `
        <div class="card">
            <div class="card-body">
                <div>
                    <a href="/mypage.html?user_id=${element.owner}">
                        <img class="user-image" src=${owner_image} alt="User Image">
                        <h5 class="comment-title" id="comment-title">${element.owner_name}</h5>
                    </a>
                    <p class="card-text" id="comment_button_group_${element.id}">
                        <small class="text-muted">
                                <button type="button" id="updateCommentButton_${element.id}" value="${element.id}">수정</button>
                                <button type="button" id="deleteCommentButton_${element.id}" value="${element.id}">삭제</button>
                        </small>
                    </p>
                </div>
                
                <div class="comment_box" id="comment_box_${element.id}">
                    <p>${element.comment}</p>
                </div>
                <div id="updateCommentForm_${element.id}" class="comment_box" style="display: none;">
                    <div class="col-auto">
                        <input type="text" class="form-control-plaintext" id="newCommentData_${element.id}"
                            value="${element.comment}">
                    </div>
                    <div class="col-auto">
                        <button type="button" class="btn btn-primary mb-3" id="sumbitCommentButton_${element.id}">제출</button>
                    </div>
                </div>
        </div>
        `
    });
    response_json.forEach(element => {
        const updateCommentButton = document.getElementById(`updateCommentButton_${element.id}`);
        const deleteCommentButton = document.getElementById(`deleteCommentButton_${element.id}`);
        const sumbitCommentButton = document.getElementById(`sumbitCommentButton_${element.id}`);
        if (payloadParse.user_id == element.owner) {
            updateCommentButton.addEventListener("click", function () {
                const comment_id = element.id;
                updateComment(comment_id);
            });
            deleteCommentButton.addEventListener("click", function () {
                const comment_id = element.id;
                deleteComment(comment_id);
            });
            sumbitCommentButton.addEventListener("click", function () {
                const comment_id = element.id;
                sumbitComment(comment_id);
            });

        } else {
            updateCommentButton.style.display = "none"
            deleteCommentButton.style.display = "none"
        }
    })
}







// 댓글 작성
export async function Comment() {

    const challenge_id = await getChallengeId()
    const comment = await writeComment(challenge_id)
    if (comment.status == 201) {
        alert("작성 완료!")
        location.reload();
    } else {
        alert("작성 실패!")
    }
}



// 댓글 수정

export async function updateComment(comment_id) {
    const comment_box = document.getElementById(`comment_box_${comment_id}`)
    const updateCommentForm = document.getElementById(`updateCommentForm_${comment_id}`)
    const comment_button_group = document.getElementById(`comment_button_group_${comment_id}`)
    if (comment_box.style.display == "none") {
        comment_box.style.display = "block"
        updateCommentForm.style.display = "none"
        // comment_button_group.style.display = "block"
    } else {
        comment_box.style.display = "none"
        updateCommentForm.style.display = "block"
        comment_button_group.style.display = "none"
    }
    // response = await updateCommentAPI(comment_id)
}


export async function sumbitComment(comment_id) {
    const newCommentData = document.getElementById(`newCommentData_${comment_id}`).value
    const commentArr = [
        newCommentData,
        comment_id,
    ]
    const response = await updateCommentAPI(commentArr)

    try {
        const response_json = await response.json()
        console.log(response_json)
        if (response.status == 200) {
            alert(response_json.message)
            location.reload();
        } else if (response.status == 400) {
            // serialzier error
            alert(response_json)
            location.reload();
        } else if (response.status == 403) {
            alert(response_json.message)
            location.reload();
        } else if (response.status == 404) {
            alert("이미 삭제된 댓글 입니다.")
            location.reload();
        } else {
            // 반례
            console.log(response_json)
        }
    } catch (error) {
        // 게시글 삭제시 비동기 에러  보완
        alert("삭제되었습니다.")
        location.reload();
    }
}

// 댓글 삭제
export async function deleteComment(comment_id) {
    const response = await deleteCommentAPI(comment_id)
    try {
        const response_json = await response.json()
        console.log(response_json)
        if (response.status == 204) {
            alert(response_json.message)
            location.reload();
        } else if (response.status == 403) {
            alert(response_json.message)
            location.reload();
        } else if (response.status == 404) {
            alert("이미 삭제된 댓글 입니다.")
            location.reload();
        } else {
            // 반례
            console.log(response_json)
        }
    } catch (error) {
        // 게시글 삭제시 비동기 에러  보완
        alert("삭제되었습니다.")
        location.reload();
    }

}

window.onload = async function () {
    showCommentList()
    document.getElementById("commentbutton").addEventListener("click", Comment)
}
