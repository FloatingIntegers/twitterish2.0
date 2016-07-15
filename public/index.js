const tweetText = document.getElementById('tweetText');
const tweetButton = document.getElementById('tweetButton');
const dashboard = document.getElementById('dashboard');
const formSubmit = document.getElementById('form-submit');
const formContainer = document.getElementById('form-container');

function clearDashboard() {
  while(dashboard.firstChild){
    dashboard.removeChild(dashboard.firstChild);
  }
}

function displayTweets(tweets) {
  tweets.forEach((element) => {
    const tweetDiv = document.createElement('div');
    const text = document.createTextNode(`${element.username}: ${element.tweets}`);
    tweetDiv.appendChild(text);
    dashboard.appendChild(tweetDiv);
  });
}

function hideLoginForm () {
  formContainer.classList.toggle('hidden');
  dashboard.className = '';
}

function login() {
  const xhr = new XMLHttpRequest();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  let qString = `/user?username=${username}&password=${password}`;
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const id = JSON.parse(xhr.response).id;
      document.cookie = `id${id}=${id}`;
      alert(`You are now logged in as: ${username}`);
    }
  }
  xhr.open("POST", qString, true);
  xhr.send();
  hideLoginForm();
}

function postTweet() {
  const xhr = new XMLHttpRequest();
  const cookieMonster = document.cookie.split(';');
  const activeCookie = cookieMonster[cookieMonster.length - 1];
  const tweetObj = {
   cookie: activeCookie,
   text: tweetText.value
  };
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      getTweet();
      tweetText.value = '';
    }
  }
  if (tweetText.value === '') return;
  xhr.open("POST", "/postTweet", true);
  xhr.send(JSON.stringify(tweetObj));
}

function getTweet() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const tweets = JSON.parse(xhr.response).reverse();
      clearDashboard();
      displayTweets(tweets);
    }
  }
  xhr.open("GET", "/getTweet", true);
  xhr.send();
}

window.addEventListener('load', getTweet);
formSubmit.addEventListener('click', login);
tweetButton.addEventListener('click', postTweet);
