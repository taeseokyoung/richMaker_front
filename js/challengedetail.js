import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { challengeLikeAPI, challengeBookmarkAPI, updateCommentAPI, deleteCommentAPI, checkChallengeBookmarkAPI, checkChallengeLikeAPI, writeComment } from "./api.js";


// user_id - 서경
function getPayloadParse() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    return payload_parse
}


// 챌린지 id 불러오기 - 서경
function getChallengeId() {
    const urlParams = new URLSearchParams(window.location.search);
    const challenge_id = urlParams.get('challenge_id')
    return challenge_id
}


// 서경 쓰지 않음 - 다른분들도 안쓰셔도 되는 부분
// // 챌린지 북마크 등록, 취소하기
// document.getElementById("challengeBookmarkButton").addEventListener("click", challengeBookmark)
// // // 챌린지 좋아요(관심) 등록, 취소하기
// document.getElementById("challengeLikeButton").addEventListener("click", challengeLike)


// // 해당 챌린지에 참여중인(북마크 등록한) 유저 리스트 뽑아오기
// document.getElementById("showBookmarkingList").addEventListener("click", showBookmarkingList);
// // 해당 챌린지에 관심등록(좋아요 누른) 유저 리스트 뽑아오기
// document.getElementById("showLikingList").addEventListener("click", showLikingList);


// 챌린지 가져오기 - 서경
export async function handleChallenge() {
    const challenge_id = await getChallengeId()
    const response = await fetch(`${BACK_BASE_URL}/api/challenge/${challenge_id}/`,)
    const data = await response.json();
    document.querySelector('#preview-image').setAttribute('src', `${BACK_BASE_URL}${data['main_image']}`)
    document.querySelector('#challenge_title').value = data.challenge_title
    document.querySelector('#period').value = data.period
    document.querySelector('#amount').value = data.amount
    document.querySelector('#exampleFormControlTextarea1').value = data.challenge_content

    //disabled = true 처리
    document.querySelector('#challenge_title').disabled = true;
    document.querySelector('#main_image').disabled = true;
    document.querySelector('#period').disabled = true;
    document.querySelector('#amount').disabled = true;
    document.querySelector('#exampleFormControlTextarea1').disabled = true;

    document.querySelector('#submit-btn').style.display = 'none';
}
handleChallenge()

// 지금 사용하지 않아 주석처리
// //  챌린지 관심 등록한 유저 리스트 뽑아오기
// export async function showLikingListAPI(user_id) {
//     const response = await fetch(`${BACK_BASE_URL}/api/users/likes/${user_id}/`)
//     return response

// }
// //  챌린지 북마크 등록한 유저 리스트 뽑아오기
// export async function showBookmarkingListAPI(user_id) {
//     const response = await fetch(`${BACK_BASE_URL}/api/users/bookmark/${user_id}/`)
//     return response

//}

// 챌린지 수정하기 : input 값들을 수정 가능한 상태로 변경 - 서경
document.getElementById('edit-btn').addEventListener('click', async function () {
    //disabled = false 처리
    document.querySelector('#challenge_title').disabled = false;
    document.querySelector('#main_image').disabled = false;
    document.querySelector('#period').disabled = false;
    document.querySelector('#amount').disabled = false;
    document.querySelector('#exampleFormControlTextarea1').disabled = false;
    document.querySelector('#submit-btn').style.display = 'block';
    document.querySelector('#edit-btn').style.display = 'none';
});

// 챌린지 수정 완료 : 변경값을 백엔드로 전달 - 서경
document.getElementById('submit-btn').addEventListener('click', async function () {
    const challenge_id = await getChallengeId()
    const token = localStorage.getItem("access");

    const challenge_title = document.getElementById("challenge_title").value;
    const challenge_content = document.getElementById("exampleFormControlTextarea1").value;
    const amount = document.getElementById("amount").value;
    const period = document.getElementById("period").value;
    const main_image = document.getElementById("main_image").files[0];

    const formData = new FormData();

    formData.append("challenge_title", challenge_title);
    formData.append("challenge_content", challenge_content);
    formData.append("amount", amount);
    formData.append("period", period);
    if (main_image) {
        formData.append("main_image", main_image);
    }

    if (challenge_title && challenge_content) {
        const response = await fetch(`${BACK_BASE_URL}/api/challenge/${challenge_id}/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.status == 200) {
            alert("챌린지 수정 완료!");
            window.location.replace(`${FRONT_BASE_URL}/challengedetail.html?challenge_id=${challenge_id}`);
        } else {
            const result = await response.json()
            alert("작성이 취소되었습니다.");
        }
    } else {
        alert("빈칸을 작성해주세요.");
    }
})


// 이미지 미리보기 - 서경
document.getElementById('main_image').addEventListener('change', function () {
    readURL(this)
})

function readURL(input) {
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


//  챌린지에 참여하는 유저 정보 불러오기 (username, profile_img, bookmark, like) - 서경 작업중
async function showBookmarkingListAPI() {
    const token = localStorage.getItem("access")
    const challenge_id = getChallengeId()
    const response_challenge_user = await fetch(`${BACK_BASE_URL}/api/users/bookmark/${challenge_id}/`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    },)
    const response_data = await response_challenge_user.json()
    return response_data
}
// export async function showBookmarkingList() {
//     const challenge_id = await getChallengeId()
//     const response = await showBookmarkingListAPI(challenge_id)
//     const response_json = await response.json()
//     if (response.status == 200) {
//         console.log(response_json)
//     } else {
//         console.log(response_json)
//     }
// }



// 챌린지 유저 네임 프로필 사진 가져오기 테스트 - 서경
document.getElementById("challenge-btn").addEventListener("click", challengeBookmark)

// 챌린지 시작 등록, 취소하기 - 서경 주석
// document.getElementById("challenge-btn").addEventListener("click", showBookmarkingList)


// // 챌린지 좋아요(관심) 등록, 취소하기 - 서경
document.getElementById("like-btn").addEventListener("click", challengeLike);


//  사용자가 챌린지 좋아요 등록 및 취소 - 서경 픽스
export async function challengeLike() {
    const challenge_id = await getChallengeId()
    const response = await challengeLikeAPI(challenge_id)
    try {
        const response_json = await response.json()
        if (response.status == 204) {
            // 챌린지 좋아요 취소
            document.querySelector('#heart').innerHTML = '<p id="heart">♡</p>'
            alert("챌린지 좋아요를 취소하였습니다.")
        } else if (response.status == 201) {
            document.querySelector('#heart').innerHTML = '<p id="heart">❤</p>'
            alert("챌린지 좋아요를 눌렀습니다.")
        } else {
            // section로그인 필요 또는 찾을 수 없는 챌린지
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
        document.querySelector('#heart').innerHTML = '<p id="heart">♡</p>'
        alert("챌린지 좋아요를 취소하였습니다.")
    }
}

// 좋아요 리스트 출력 - 아직 사용하지 않아서 주석처리
// export async function showLikingList() {
//     const challenge_id = await getChallengeId()
//     const response = await showLikingListAPI(challenge_id)
//     const response_json = await response.json()
//     if (response.status == 200) {
//         console.log(response_json)

//     } else {
//         comment_box.style.display = "none"
//         updateCommentForm.style.display = "block"
//         comment_button_group.style.display = "none"
//     }
//     // response = await updateCommentAPI(comment_id)
// }

// 사용자가 챌린지 북마크 등록 및 취소
async function challengeBookmark() {
    const challengeId = getChallengeId()
    const response = await challengeBookmarkAPI(challengeId)
    try {
        const response_json = await response.json()
        if (response.status == 204) {
            // 챌린지 북마크 취소
            alert(response_json);
        } else if (response.status == 201) {
            // 챌린지 북마크 등록
            alert(response_json.message)
            window.location.reload(`${FRONT_BASE_URL}/challengedetail.html?challenge_id=${challengeId}`)
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

//  댓글 가져오기
export async function showCommentListAPI(challenge_id) {
    const response = await fetch(`${BACK_BASE_URL}/api/comment/${challenge_id}/`)

    return response
}


// 댓글
export async function Comment() {
    const challenge_id = await getChallengeId()
    const comment = await writeComment(challenge_id);
    const comment_json = await comment.json();
    window.location.replace(`${FRONT_BASE_URL}/challengedetail.html?challenge_id=${challenge_id}`);
}

// 댓글 작성
// export async function Comment() {

//     const challenge_id = await getChallengeId()
//     const comment = await writeComment(challenge_id)
//     if (comment.status == 201) {
//         alert("작성 완료!")
//         location.reload();
//     } else {
//         alert("작성 실패!")
//     }
// }


// export async function showBookmarkingList() {
//     const challengeId = await getChallengeId()
//     const response = await showBookmarkingListAPI(challengeId)
//     const response_json = await response.json()
//     if (response.status == 200) {
//         console.log(response_json)
//     } else {
//         console.log(response_json)
//     }
// }


// export async function showLikingList() {
//     const challengeId = await getChallengeId()
//     const response = await showLikingListAPI(challengeId)
//     const response_json = await response.json()
//     if (response.status == 200) {
//         console.log(response_json)

//     } else {
//         comment_box.style.display = "none"
//         updateCommentForm.style.display = "block"
//         comment_button_group.style.display = "none"
//     }
//     // response = await updateCommentAPI(comment_id)
// }


// 댓글 리스트 조회
export async function showCommentList() {
    const challenge_id = await getChallengeId()
    const response = await showCommentListAPI(challenge_id)
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
                    <p class="card-text"></p>
                        <small class="text-muted" id="comment_button_group_${element.id}">
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
    // 이벤트 리스너 할당은 반복문 외부에서 처리합니다.
    response_json.forEach(element => {
        const updateCommentButton = document.getElementById(`updateCommentButton_${element.id}`);
        const deleteCommentButton = document.getElementById(`deleteCommentButton_${element.id}`);
        const sumbitCommentButton = document.getElementById(`sumbitCommentButton_${element.id}`);
        const comment_button_group = document.getElementById(`comment_button_group_${element.id}`)
        if (payloadParse != null) {

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
                comment_button_group.style.display = "none"
            }

        } else {

            comment_button_group.style.display = "none"
        }

    })
}


// 댓글 수정
export async function updateComment(comment_id) {
    const comment_box = document.getElementById(`comment_box_${comment_id}`)
    const updateCommentForm = document.getElementById(`updateCommentForm_${comment_id}`)
    const comment_button_group = document.getElementById(`comment_button_group_${comment_id}`)
    console.log(comment_button_group)
    if (comment_box.style.display == "none") {

        comment_box.style.display = "block"
        updateCommentForm.style.display = "none"
        comment_button_group.style.display = "none"
    } else {

        comment_box.style.display = "none"
        updateCommentForm.style.display = "block"
        comment_button_group.style.display = "none"
    }
    // response = await updateCommentAPI(comment_id)
    comment_button_group.style.display = "none"
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


export async function checkUserInfo() {
    const PayloadParse = await getPayloadParse()

    if (PayloadParse != null) {
        const challenge_id = await getChallengeId()
        const CheckBookmarkResponse = await checkChallengeBookmarkAPI(challenge_id)
        if (CheckBookmarkResponse.status == 200) {
        } else {

        }

        const CheckLikeResponse = await checkChallengeLikeAPI(challenge_id)

    } else {
        // 로그인 안한 사용자
    }
}


window.onload = async function () {
    showCommentList()
    checkUserInfo()
    const kimchi = await showBookmarkingListAPI()

    kimchi.bookmarking_people.forEach((e) => {
        let image_a = 0;
        if (e.profile_image !== null) {
            image_a = e.profile_image;
        } else {
            image_a = './img/richmaker-logo.png';
        }

        document.querySelector("#challenge-people-list").innerHTML += `<div class="people">
                                                            <a href="/mypage.html?user_id=${e.id}">
                                                            <p>${e.username}</p>
                                                            <img src="${BACK_BASE_URL}/${image_a}" alt="">
                                                            </a>
                                                        </div>`;
    })


    document.getElementById("commentbutton").addEventListener("click", Comment)
}
