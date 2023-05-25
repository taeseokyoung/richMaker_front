function requestWithBase64 (base64String) {

  const timeaa = Date.now();
  axios
    .post(
      'https://7y32xyp5al.apigw.ntruss.com/custom/v1/22746/a95dff560047aeb4f5cd2d25581b2eb3ce725a9f91bd9809a96659dd2ea73d88/document/receipt', // APIGW Invoke URL
      {
        images: [
          {
            format: base64String.split(',')[0].split('/')[1].split(';')[0], // file format
            name: 'aa', // image name
            data: base64String.split(',')[1] // image base64 string(only need part of data). Example: base64String.split(',')[1]
          }
        ],
        requestId: 'churnobyl', // unique string
        timestamp: timeaa,
        version: 'V2'
      },
      {
        headers: {
          'X-OCR-SECRET': 'VU1GclRnbGZwWWd2cVVMR1ZiVmJzYVpSY1pXRml3RmE=' // Secret Key 
        }
      }
    )
    .then(res => {
      if (res.status === 200) {
        console.log('requestWithBase64 response:', res.data)
      }
    })
    .catch(e => {
      console.warn('requestWithBase64 error', e.response)
    })
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

const btnAiCheck = document.querySelector('#aiCheck');
btnAiCheck.addEventListener('click', async function (event) {
  const checkPreview = document.querySelector('#preview');

  const response = await fetch(`${BACK_BASE_URL}/api/post/ai/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      base64String: checkPreview.src
    })
  })
  
  response_json = await response.json();
  console.log(JSON.parse(response_json));

});