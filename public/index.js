const tweetText = document.getElementById('tweetText');
const tweetButton = document.getElementById('tweetButton');
const dashboard = document.getElementById('dashboard');
// const loginForm = document.getElementById('login');
const formSubmit = document.getElementById('form-submit');


function postTweet() {
  const xhr = new XMLHttpRequest();
  const cookieMonster = document.cookie;
  const cookies = cookieMonster.split(';');
  const activeCookie = cookies[cookies.length - 1];
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      location.reload(true);
    }
  }
  xhr.open("POST", "/postTweet", true);
   const tweetObj = {
    cookie: activeCookie,
    text: tweetText.value
  }
  xhr.send(JSON.stringify(tweetObj));
}

function getTweet() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const tweets = JSON.parse(xhr.response);
      tweets.forEach((element) => {
        const tweetDiv = document.createElement('div');
        const text = document.createTextNode(`${element.username}: ${element.tweets}`);
        tweetDiv.appendChild(text);
        dashboard.appendChild(tweetDiv);
      });
    }
  }
  xhr.open("GET", "/getTweet", true);
  xhr.send();
}

function login() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const id = JSON.parse(xhr.response).id;
      document.cookie = `id${id}=${id}`;
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
