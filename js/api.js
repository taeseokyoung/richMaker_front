const BACK_BASE_URL = "http://127.0.0.1:8000";
const FRONT_BASE_URL = "http://127.0.0.1:5500";

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


export async function EmailAuthenticationAPI() {
    const email = document.getElementById("email").value
    const auth_code = document.getElementById("auth_code").value
    console.log(email, auth_code)
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
export async function LoginAPI() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const response = await fetch(`${BACK_BASE_URL}/api/users/login/`, {
        // fetch post 통신이 완료될때까지 기다리고, api에서는 세션의 토큰을 반환한다.
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

//  로그아웃
export function logoutAPI() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.reload();
}
