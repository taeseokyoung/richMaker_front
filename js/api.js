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

// 유저 프로필 수정 API
export async function updateUserProfileAPI() {
    const username = document.getElementById("username").value
    const bio = document.getElementById("bio").value
    const profile_image = document.getElementById("image").files[0]

    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    const access_token = localStorage.getItem("access")
    const user_id = payload_parse.user_id

    const formdata = new FormData();
    formdata.append('username', username)
    formdata.append('bio', bio)

    if (profile_image) {
        formdata.append('profile_image', profile_image)
    } else {
        formdata.append('profile_image', '')
    }

    try {
        const response = await fetch(`${BACK_BASE_URL}/api/users/profile/${user_id}/`, {
            headers: { "Authorization": `Bearer ${access_token}` },
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
