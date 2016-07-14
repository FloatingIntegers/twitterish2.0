const tweetText = document.getElementById('tweetText');
const tweetButton = document.getElementById('tweetButton');
const dashboard = document.getElementById('dashboard');
// const loginForm = document.getElementById('login');
const formSubmit = document.getElementById('form-submit');


function postTweet() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      tweetText.value = '';
    }
  }
  xhr.open("POST", "/postTweet", true);
  xhr.send(tweetText.value);
}

function getTweet() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const tweetDiv = document.createElement('div');
      const text = document.createTextNode(xhr.response);
      tweetDiv.appendChild(text);
      dashboard.appendChild(tweetDiv);
    }
  }
  xhr.open("GET", "/getTweet", true);
  xhr.send();
}

function login() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr.response);
    }
  }
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  let qString = `/user?username=${username}&password=${password}`;
  xhr.open("POST", qString, true);
  xhr.send();
}

window.addEventListener('load', getTweet);
formSubmit.addEventListener('click', login);
tweetButton.addEventListener('click', postTweet);
