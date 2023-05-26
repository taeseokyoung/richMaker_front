// import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";
const BACK_BASE_URL = "http://127.0.0.1:8000";
const FRONT_BASE_URL = "http://127.0.0.1:5500";

handleChallenge()

async function handleChallenge() {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('challenge_id')

    const response = await fetch(`${BACK_BASE_URL}/api/challenge/${challengeId}`,)

    const data = await response.json();
    document.querySelector('#main_image').setAttribute('src', `${BACK_BASE_URL}${data['main_image']}`)
    document.querySelector('#challenge_title').value = data.challenge_title
    document.querySelector('#period').value = data.period
    document.querySelector('#amount').value = data.amount
    document.querySelector('.note-editable p').innerHTML = data.challenge_content
    console.log(data)
}




// async function Challenge() {
//     const response = await getChallenge(challengeId)
//     console.log(response)
// }