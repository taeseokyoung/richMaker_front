import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
import { getUserInfo, getBookmarkInfo, showBookmarkChallengesAPI, showlikeChallengesAPI } from "./api.js";

// document.getElementById("ProfileButton").addEventListener("click", ProfileButtonEvent);
// document.getElementById("updateUserProfileButton").addEventListener("click", updateUserProfileButtonEvent);



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


    // 성공했을때만 값을 변경함
    if (response.status == 200) {
        // htmil의 id값을 가져아서 변수에 저장
        const email = document.getElementById("user-email")
        const username = document.getElementById("user-name")
        const profile_image = document.getElementById("user-image")
        const bio = document.getElementById("user-bio")
        // const bookmark = document.getElementById("bookmark-title")

        // 변수 안에 들어갈 텍스트를 응답값으로 변경
        email.innerText = response_json.email
        username.innerText = response_json.username
        bio.innerText = response_json.bio
        // bookmark.innerText = response_json.bookmark


        if (payload_parse.email != response_json.email) {
            document.getElementById("ProfileButton").style.display = "none"
        }

        // 이미지 값 변경이 있을때만 수정
        if (response_json.profile_image != null) {
            profile_image.setAttribute("src", `${BACK_BASE_URL}${response_json.profile_image}`)
        }

    } else if (response.status == 404) {
        console.log("찾는 계정이 없습니다 ")

    }
    await showBookmarkChallenges(searchID)
    await showlikeChallenges(searchID)

}

export async function showBookmarkChallenges(user_id) {
    const response = await showBookmarkChallengesAPI(user_id)
    const response_json = await response.json()

    // console.log(response_json)

    const newChallenge = response_json.bookmark;
    console.log(newChallenge.length)
    const newChallengeCountData = newChallenge.length
    // console.log(newChallengeCountData)
    const newChallengeListData = newChallenge
    console.log(newChallengeListData)

    const newChallengeList = document.querySelector(".slider");
    const newChallengeCount = document.querySelector(".new-challenge-count");

    // if (response_json.main_image == null) {
    //     document.getElementById('preview').src = "./fake-img/paris.png";
    // } else {
    //     document.getElementById('preview').setAttribute("src", `${BACK_BASE_URL}${response_json.main_image}`)
    // }


    newChallengeListData.forEach((element) => {
        const main_image = element.main_image == '/media/media/no_image.jpg' ? './fake-img/paris.png' : `${BACK_BASE_URL}${element.main_image}`
        newChallengeList.innerHTML += `<div class="card">
                                      <a href="/challenge-detail.html?challenge_id=${element.id}">
                                          <div class="card-image-container">
                                            <img src="${main_image}">
                                          </div> 
                                          <div class="card-content-container">
                                            <h2>${element.challenge_title}</h2>
                                            <h3>목표: ${element.amount}만원</h3>
                                            <h3>${element.period}개월</h3>
                                            
                                          </div>
                                      </a>
                                    </div>`;
    })
}



export async function showlikeChallenges(user_id) {
    const response = await showlikeChallengesAPI(user_id)
    const response_json = await response.json()


    const newChallenge = response_json.challenge_like;
    console.log(newChallenge.length)
    const newChallengeCountData = newChallenge.length;
    // console.log(newChallengeCountData)
    const newChallengeListData = newChallenge;
    console.log(newChallengeListData)

    const newChallengeList = document.querySelector(".slider_box");
    const newChallengeCount = document.querySelector(".like_box");

    // if (response_json.main_image == null) {
    //     document.getElementById('preview').src = "./fake-img/paris.png";
    // } else {
    //     document.getElementById('preview').setAttribute("src", `${BACK_BASE_URL}${response_json.main_image}`)
    // }


    newChallengeListData.forEach((element) => {
        const main_image = element.main_image == '/media/media/no_image.jpg' ? './fake-img/paris.png' : `${BACK_BASE_URL}${element.main_image}`
        newChallengeList.innerHTML += `<div class="card_box">
        
                                      <a href="/challenge-detail.html?challenge_id=${element.id}">
                                          <div class="card-image-container">
                                            <img src="${main_image}">
                                          </div> 
                                          <div class="card-content-container">
                                            <h2>${element.challenge_title}</h2>
                                            <h3>목표: ${element.amount}만원</h3>
                                            <h3>${element.period}개월</h3>
                                            
                                          </div>
                                          
                                      </a>
                                      
                                    </div>`;

    })
}










// const newChallenge = response_json
// console.log(newChallenge)
// const newChallengeListData = newChallenge.bookmark;
// console.log(newChallengeListData)
// const newChallengeList = document.getElementById("bookmark_box");


// newChallengeListData.forEach((element) => {
//     newChallengeList.innerHTML += `<div class="card" style="border-radius: 10px;">
//                                 <div class="imagebox">
//                                     <div class="box" style="background: rgba(231, 57, 34, 0.322);">
//                                         <img class="profile" src="">
//                                     </div>
//                                     </div>
//                                     <div class="card-body">
//                                         <h5 class="card-title" id="bookmark-title">${element.challenge_title}</h5>
//                                         <p class="card-text" id="bookmark-content">${element.challenge_content}</p>
//                                     </div>
//                                 <div class="card-footer" id="bookmark-money">
//                                     <small class="text-body-secondary">목표 금액 : ${element.amount}</small>
//                                 </div>
//                             </div>`;
// });


// export async function showlikeChallenges(user_id) {
//     const response = await showlikeChallengesAPI(user_id)
//     const response_json = await response.json()
// }