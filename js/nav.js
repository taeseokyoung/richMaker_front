async function injectNavbar() {
  fetch("./nav.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      document.querySelector(".nav-container").innerHTML = data;
    });

  const navbarHtml = await fetch("./nav.html");
  let data = await navbarHtml.text();
  document.querySelector(".nav-container").innerHTML = data;
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
