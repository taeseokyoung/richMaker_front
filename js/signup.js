// import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
const BACK_BASE_URL = "http://127.0.0.1:8000";
const FRONT_BASE_URL = "http://127.0.0.1:5501";
const API_USERS = "api/users";

async function handleSignup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  const username = document.getElementById("username").value;
  const bio = document.getElementById("bio").value;
  const profile_image = document.getElementById("image");

  if (password != password2) {
    alert("입력하신 두 비밀번호가 일치하지 않습니다.");
  } else {
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("username", username);
    formdata.append("bio", bio);

    if (profile_image) {
      formdata.append("profile_image", profile_image.files[0]);
    } else {
      formdata.append("profile_image", "");
    }
    try {
      const response = await fetch(`${BACK_BASE_URL}/${API_USERS}/sign-up/`, {
        headers: {},
        method: "POST",
        body: formdata,
      });
      const response_json = await response.json();
      if (response.status == 200) {
        changeInputStyle();
        alert(response_json.message);
      } else {
        alert(response_json.message);
        console.log(response_json);
      }
    } catch (err) {
      // 서버 오류
      console.error(err);
    }
  }
}

async function changeInputStyle() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const password2 = document.getElementById("password2");
  const username = document.getElementById("username");
  const bio = document.getElementById("bio");
  const profile_image = document.getElementById("image");
  email.readOnly = true;
  password.readOnly = true;
  password2.readOnly = true;
  username.readOnly = true;
  bio.readOnly = true;
  profile_image.style.display = "none";
}

async function EmailAuthentication() {
  const email = document.getElementById("email").value;
  const auth_code = document.getElementById("auth_code").value;
  console.log(email, auth_code);
  const response = await fetch(`${BACK_BASE_URL}/${API_USERS}/sign-up/`, {
    headers: {
      "content-type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      email: email,
      auth_code: auth_code,
    }),
  });
  const response_json = await response.json();
  if (response.status == 200) {
    alert(response_json.message);
    window.location.replace(`${FRONT_BASE_URL}/html/login.html`);
  } else if (response.status == 400 || response.status == 401) {
    alert(response_json.message);
  } else if (response.status == 404) {
    alert("등록된 이메일 정보가 없습니다.");
  }
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("preview").src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    document.getElementById("preview").src = "";
  }
}
