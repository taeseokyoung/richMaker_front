const BACK_BASE_URL = "http://127.0.0.1:8000";
const FRONT_BASE_URL = "http://127.0.0.1:5500";

//  회원 가입 API
export async function signupAPI() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const password2 = document.getElementById("password2").value
    const username = document.getElementById("username").value
    const bio = document.getElementById("bio").value
    const profile_image = document.getElementById("image").files[0]
    if (password != password2) {
        alert("입력하신 두 비밀번호가 일치하지 않습니다.")
    } else {
        const formdata = new FormData();
        formdata.append('email', email)
        formdata.append('password', password)
        formdata.append('username', username)
        formdata.append('bio', bio)

        if (profile_image) {
            formdata.append('profile_image', profile_image)
        } else {
            formdata.append('profile_image', '')
        }

        try {
            const response = await fetch(`${BACK_BASE_URL}/api/users/sign-up/`, {
                headers: {},
                method: 'POST',
                body: formdata
            })
            return response
        } catch (err) {
            console.log(err)
        }
    }
}

// 계정 활성화를 위한 이메일 인증 API
export async function EmailAuthenticationAPI() {
    const email = document.getElementById("email").value
    const auth_code = document.getElementById("auth_code").value
    const response = await fetch(`${BACK_BASE_URL}/api/users/sign-up/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({
            "email": email,
            "auth_code": auth_code
        })
    })
    return response
}
//  로그인 API
export async function LoginAPI() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const response = await fetch(`${BACK_BASE_URL}/api/users/login/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "password": password,
        })
    })
    return response
}

//  로그인한 사용자의 비밀번호 재 설정 API
export async function updatePassWordAPI() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    const access_token = localStorage.getItem("access")
    const user_id = payload_parse.user_id

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const auth_code = document.getElementById("auth_code").value

    const response = await fetch(`${BACK_BASE_URL}/api/users/${user_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`
        },
        method: 'PUT',
        body: JSON.stringify({
            "email": email,
            "auth_code": auth_code,
            "password": password
        })
    })
    return response
}

//  인증 코드 발급 API
export async function getAuthCodeAPI() {
    const email = document.getElementById("email").value
    const response = await fetch(`${BACK_BASE_URL}/api/users/get-auth-token/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
        })
    })
    return response
}

// 비밀번호 재 설정 API(로그인 안한 유저가, 자신의 비밀번호를 재 설정 하고자 할 때)
export async function passwordResetAPI() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const auth_code = document.getElementById("auth_code").value

    const response = await fetch(`${BACK_BASE_URL}/api/users/sign-up/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
            "email": email,
            "auth_code": auth_code,
            "password": password
        })
    })
    return response
}

// 휴면 계정으로 전환
export async function switchAccountAPI() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    const user_id = payload_parse.user_id

    const access_token = localStorage.getItem("access")
    const email = document.getElementById("email").value
    const auth_code = document.getElementById("auth_code").value

    const response = await fetch(`${BACK_BASE_URL}/api/users/${user_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`
        },
        method: 'DELETE',
        body: JSON.stringify({
            "email": email,
            "password": auth_code
        })
    })
    return response
}

export async function getUserInfo(user_id) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/${user_id}/`)
    return response
}

export async function getBookmarkInfo(challenge_id) {


    const response = await fetch(`${BACK_BASE_URL}/api/get-challenge/${challenge_id}/`)
    return response
}

// 지수 코드 //

// 수입 코드
// 수입 기록
export async function Income() {
    //console.log("연결")
    let token = localStorage.getItem("access")

    // date, income_money를 받는다.
    const date = await document.getElementById('date-income').value
    //console.log(date)
    const income_money = await document.getElementById('income_money').value
    //console.log(income_money)

    const request_already_income = await fetch(`${BACK_BASE_URL}/api/post/income/${date}/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })

    const request_already_income_json = await request_already_income.json()
    //console.log(request_already_income_json)

    if (request_already_income_json == "") {
        const request_income = await fetch(`${BACK_BASE_URL}/api/post/income/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                "date": date,
                "income_money": income_money
            })
        })
        // console.log(request_income)
        return request_income.status
    } else {
        const request_status = 400
        return request_status
    }


}


// 날짜에 대한 수입내역
export async function getIncome(day) {
    const response_income = await fetch(`${BACK_BASE_URL}/api/post/income/${day}/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })

    return response_income
}

// 수입업데이트
export async function IncomeUpdate() {
    let token = localStorage.getItem("access")

    // date, income_money를 받는다.
    const date = await document.getElementById('date-income2').value
    const income_money = await document.getElementById('income_money2').value


    const request_income = await fetch(`${BACK_BASE_URL}/api/post/income/${date}/`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "date": date,
            "income_money": income_money
        })
    })

    return request_income
}


// 수입삭제
export async function IncomeDelete() {
    let token = localStorage.getItem("access")

    // date, income_money를 받는다.
    const date = await document.getElementById('date-income3').value


    const request_income = await fetch(`${BACK_BASE_URL}/api/post/income/${date}/`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    return request_income
}

// 지출 코드

// 지출 작성하기
export async function writeMinus() {
    let token = localStorage.getItem("access")

    const year = document.getElementById("calYear").innerText
    const month = document.getElementById("calMonth").innerText
    const date = document.getElementsByClassName("choiceDay")[0].innerText
    const day = year + '-' + month + '-' + date


    const placeName = await document.getElementById('placename2').value
    const placeWhere = await document.getElementById('placewhere2').value
    const Amount = await document.getElementById('amount2').value
    const Cost = await document.getElementById('cost2').value

    const query = 'input[name="style"]:checked';
    const selectedEls = document.querySelectorAll(query)
    let Style = 0

    selectedEls.forEach((el) => {
        Style = parseInt(el.value)
    })

    const request_post = await fetch(`${BACK_BASE_URL}/api/post/minus/`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "date": day,
            "minus_money": Cost,
            "placename": placeName,
            "placewhere": placeWhere,
            "amount": Amount,
            "consumer_style": Style //1
        })
    })

    return request_post

}


// 지출 자세히보기
export async function getMinusDetail(consume_id) {
    let token = localStorage.getItem("access")
    const consume_response = await fetch(`${BACK_BASE_URL}/api/post/minus/${consume_id}/`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        },
    })

    return consume_response
}


// 날짜에 대한 지출 기록내역
export async function getMinus(day) {
    console.log('연결!')
    const response_minus = await fetch(`${BACK_BASE_URL}/api/post/minus/${day}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })
    //console.log(response_minus)
    return response_minus
}



// 지출수정하기
export async function Edit(minus_id) {
    let token = localStorage.getItem("access")
    console.log(typeof (minus_id))
    console.log(minus_id)

    const year = document.getElementById("calYear").innerText
    const month = document.getElementById("calMonth").innerText
    const date = document.getElementsByClassName("choiceDay")[0].innerText
    console.log(date)
    const day = year + '-' + month + '-' + date


    const placeName = await document.getElementById('placename2').value
    const placeWhere = await document.getElementById('placewhere2').value
    const Amount = await document.getElementById('amount2').value
    const Cost = await document.getElementById('cost2').value

    const query = 'input[name="style"]:checked';
    const selectedEls = document.querySelectorAll(query)
    let Style = 0

    selectedEls.forEach((el) => {
        Style = parseInt(el.value)
    })

    const request_post = await fetch(`${BACK_BASE_URL}/api/post/minus/${minus_id}/`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "date": day,
            "minus_money": Cost,
            "placename": placeName,
            "placewhere": placeWhere,
            "amount": Amount,
            "consumer_style": Style //1
        })
    })

    return request_post
}

// 지출 삭제하기
export async function Delete(minusid) {
    let token = localStorage.getItem("access")
    console.log(minusid)

    const request_minus = await fetch(`${BACK_BASE_URL}/api/post/minus/${minusid}/`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })

    return request_minus
}



// 소비경향 가져오기
export async function getStyle() {
    const response_style = await fetch(`${BACK_BASE_URL}/api/post/style/`, {
        method: 'GET'
    });

    return response_style
}


// 저축 코드
// 날짜에 대한 저축 기록 불러오기
export async function getPlus(day) {
    const response_plus = await fetch(`${BACK_BASE_URL}/api/post/plus/${day}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })

    return response_plus
}


// 저축기록하기
export async function Saving() {
    let token = localStorage.getItem("access")

    // date, plus_money, challenge를 받는다.
    const date = document.getElementById('date-plus').value
    const plus_money = document.getElementById('plus_money').value
    const query = 'input[name="challenge"]:checked';
    const selectedEls = document.querySelectorAll(query)
    let challenge = 0

    selectedEls.forEach((el) => {
        challenge = parseInt(el.value)
    })

    const request_already_plus = await fetch(`${BACK_BASE_URL}/api/post/plus/${challenge}/${date}/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })

    const request_already_plus_json = await request_already_plus.json()
    //console.log(request_already_plus_json)

    if (request_already_plus_json == "") {
        const request_saving = await fetch(`${BACK_BASE_URL}/api/post/plus/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                "date": date,
                "plus_money": plus_money,
                "challenge": challenge
            })
        })

        return request_saving.status
    } else {
        const request_status = 400
        return request_status
    }


}


//저축 수정하기
export async function SavingUpdate() {
    let token = localStorage.getItem("access")

    // date, plus_money, challenge를 받는다.
    const date = document.getElementById('date-plus2').value
    const plus_money = document.getElementById('plus_money2').value
    const query = 'input[name="challenge"]:checked';
    const selectedEls = document.querySelectorAll(query)
    let challenge = 0

    selectedEls.forEach((el) => {
        challenge = parseInt(el.value)
    })
    console.log(challenge)

    const request_saving = await fetch(`${BACK_BASE_URL}/api/post/plus/${challenge}/${date}/`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "date": date,
            "plus_money": plus_money,
            "challenge": challenge
        })
    })

    return request_saving
}



//저축 삭제하기
export async function SavingDelete() {
    let token = localStorage.getItem("access")

    // date, plus_money, challenge를 받는다.
    const date = document.getElementById('date-plus3').value
    const query = 'input[name="challenge"]:checked';
    const selectedEls = document.querySelectorAll(query)
    let challenge = 0

    selectedEls.forEach((el) => {
        challenge = parseInt(el.value)
    })
    console.log(challenge)

    const request_saving = await fetch(`${BACK_BASE_URL}/api/post/plus/${challenge}/${date}/`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    return request_saving
}


// 챌린지 가져오기
export async function getChallenge() {
    let token = localStorage.getItem("access")

    const response_challenge = await fetch(`${BACK_BASE_URL}/api/challenge/`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    return response_challenge
}

// 사용자가 챌린지 좋아요 등록 및 취소 API
export async function challengeLikeAPI(challenge_id) {
    const access_token = localStorage.getItem("access")
    const response = await fetch(`${BACK_BASE_URL}/api/users/likes/${challenge_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'PATCH',
    })
    return response
}

// 사용자가 북마크 등록 및 취소 API
export async function challengeBookmarkAPI(challenge_id) {
    const access_token = localStorage.getItem("access")
    const response = await fetch(`${BACK_BASE_URL}/api/users/bookmark/${challenge_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'PATCH',
    })
    return response
}


// 사용자가 북마크 등록했는지, 안했는지 확인
export async function checkChallengeBookmarkAPI(challenge_id) {
    const access_token = localStorage.getItem("access")
    const response = await fetch(`${BACK_BASE_URL}/api/users/bookmark/${challenge_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'POST',
    })
    return response
}

// 사용자가 좋아요 등록 했는지, 안했는지 확인
export async function checkChallengeLikeAPI(challenge_id) {
    const access_token = localStorage.getItem("access")
    const response = await fetch(`${BACK_BASE_URL}/api/users/likes/${challenge_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'GET',
    })
    return response
}



// //  댓글 가져오기 - challengedetail.js로 이동
// export async function showCommentListAPI(challenge_id) {
//     const response = await fetch(`${BACK_BASE_URL}/api/comment/${challenge_id}/`)
//     return response
// }


// 댓글 수정
export async function updateCommentAPI(commentArr) {
    const comment_title = commentArr[0]
    const comment_id = commentArr[1]
    console.log(comment_title)
    const access_token = localStorage.getItem("access")
    const response = await fetch(`${BACK_BASE_URL}/api/update-comment/${comment_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'PUT',
        body: JSON.stringify({
            "comment": comment_title,
        })
    })
    return response
}

// 댓글 삭제
export async function deleteCommentAPI(comment_id) {
    const access_token = localStorage.getItem("access")
    const response = await fetch(`${BACK_BASE_URL}/api/update-comment/${comment_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'DELETE',
    })
    return response
}
// 챌린지별 댓글 작성
export async function writeComment(challenge_id) {
    const access_token = localStorage.getItem("access")
    const comment_content = document.getElementById("comment-write").value
    //console.log(comment_content)
    const response_comment = await fetch(`${BACK_BASE_URL}/api/comment/${challenge_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'POST',
        body: JSON.stringify({
            "comment": comment_content
        })
    })
    return response_comment
}
// 유저 프로필 수정
export async function updateUserProfileAPI() {
    const username = document.getElementById("username").value
    const bio = document.getElementById("bio").value
    const profile_image = document.getElementById("image").files[0]

    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    const user_id = payload_parse.user_id
    const formdata = new FormData();
    formdata.append('username', username)
    formdata.append('bio', bio)

    const access_token = localStorage.getItem("access")
    if (profile_image) {
        formdata.append('profile_image', profile_image)
    } else {
        formdata.append('profile_image', '')
    }

    try {
        const response = await fetch(`${BACK_BASE_URL}/api/users/profile/${user_id}/`, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            },
            method: 'PATCH',
            body: formdata
        })
        return response
    } catch (err) {
        console.log(err)
    }
}

export async function showBookmarkChallengesAPI(user_id) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/get-bookmarking-challenge/${user_id}/`)
    return response
}

export async function showlikeChallengesAPI(user_id) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/get-liking-challenge/${user_id}/`)
    return response
}

export async function showBookmarkingListAPI() {
    const response = await fetch(`${BACK_BASE_URL}/api/users/get-liking-challenge/${user_id}/`)
    return response
}