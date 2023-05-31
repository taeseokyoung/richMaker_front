//  로그아웃
async function injectNavbar() {
  fetch("./nav.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      document.querySelector("nav").innerHTML = data;
    });

  const navbarHtml = await fetch("./nav.html");
  let data = await navbarHtml.text();
  document.querySelector("nav").innerHTML = data;

  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload)

  const anonymous_view = document.getElementById("anonymous_view")
  const user_view = document.getElementById("user_view")
  document.getElementById("logout_button").addEventListener("click", logout);

  if (payload_parse == null) {
    // user_view.style.display = "none"
  } else {
    // anonymous_view.style.display = "none"
  }
  if (payload_parse == null) {
    document.getElementById("dropDownMenu_1").style.display = "none"
    document.getElementById("dropDownMenu_3").style.display = "none"
    document.getElementById("dropDownMenu_2").style.display = "none"
    document.getElementById("dropDownMenu_4").innerText = "비밀 번호 찾기"

  }
}

async function logout() {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  localStorage.removeItem("payload")
  location.reload();

}
injectNavbar();


function handleBtn() {
  document.querySelector(".nav-drop-menu").classList.toggle("on");
  document.querySelector(".menu_btn").classList.toggle("on");
}
injectNavbar();


async function injectFooter() {
  fetch("./footer.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      document.querySelector("footer").innerHTML = data;
    });

  const navbarHtml = await fetch("./footer.html");
  let data = await navbarHtml.text();
  document.querySelector("footer").innerHTML = data;
}

injectFooter();

function getTime() {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload)
  const tokneLifeTime = document.getElementById("tokneLifeTime")
  if (payload_parse != null) {
    // NumericDate 형식
    // exp 1970년 ~  토큰이 만료되는 초(sec)
    let exp = payload_parse.exp
    // iat 1970년 ~ 토큰 발급 날짜까지의 초(sec)
    let iat = payload_parse.iat

    // NumericDate 형식의 현재 시간(sec) 구하기
    const now = Math.floor(Date.now() / 1000);

    // 토큰의 남은 만료기간 구하기
    const lifeTime = (exp - now) / 60

    // 토큰 유효기간이 지났다면 토큰 정보 삭제
    if (lifeTime < 0) {

      localStorage.removeItem("access")
      localStorage.removeItem("refresh")
      localStorage.removeItem("payload")
      location.reload();
      // 토큰 유효기간이 지나지 않았다면 남은 로그인 시간 출력
    } else {
      const MIN = parseInt(lifeTime)
      const SEC = parseInt(lifeTime % 1 * 60)
      tokneLifeTime.textContent = `로그인 남은 시간 : ${MIN}분 ${SEC}초`
    }
  } else {
    tokneLifeTime.style.display = "none"
  }
}
function init() {
  setInterval(getTime, 1000)
}
init()