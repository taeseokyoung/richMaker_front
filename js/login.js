const BACK_BASE_URL = "http://127.0.0.1:8000"
const FRONT_BASE_URL = "http://127.0.0.1:5501"
const API_USERS = "api/users"


//  추후 api.js에서 사용될 코드들, 개발환경에서 잠시 사용중!

async function handleLogin() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    try {
        const response = await fetch(`${BACK_BASE_URL}/${API_USERS}/login/`, {
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
        if (response.status == 200) {
            const response_json = await response.json()

            // 토큰 저장
            localStorage.setItem("access", response_json.access)
            localStorage.setItem("refresh", response_json.refresh)

            // payload 저장
            const base64Url = response_json.access.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            localStorage.setItem("payload", jsonPayload)

            window.location.replace(`${FRONT_BASE_URL}/html/main.html`);
        } else {
            document.getElementById("password").value = ""
            alert("회원정보가 일치하지 않습니다.")
        }
    } catch (err) {
        console.error(err)
    }
}