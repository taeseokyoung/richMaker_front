const BACK_BASE_URL = "http://127.0.0.1:8000"
const FRONT_BASE_URL = "http://127.0.0.1:5500"


export async function login(){
    const url = `${BACK_BASE_URL}/api/users/login/`
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    
    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body: JSON.stringify({
            'email':email,
            'password':password,
        })
    })
    if(response.status == 200){
        const response_json = await response.json()
        localStorage.setItem('refresh',response_json.refresh)
        localStorage.setItem('access',response_json.access)
        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''))
        localStorage.setItem('payload', jsonPayload)
        window.location.replace(`${FRONT_BASE_URL}/html/main.html`)
    }
}
export async function signup(){
    const url= `${BACK_BASE_URL}/api/users/sign-up/`
    const email = document.getElementById("email").value
    const username = document.getElementById("username").value
    
    const emailconfirm = document.getElementById("emailconfirm").value
    const password = document.getElementById("password").value
    const cpassword = document.getElementById("cpassword").value

    if(cpassword != password){
        alert("비밀번호가 일치하지 않습니다.")
    }
    else{
        const response = await fetch(url,{
            headers:{
                'Content-Type':'application/json'
            },
            method:'POST',
            body:JSON.stringify({
                'email':email,
                'password':password,
                'username':username,
                "code":emailconfirm
            })
        })
        if(response.status == 201){
            window.location.replace(`${FRONT_BASE_URL}/html/login.html`)
        }
    }
}