const tweetText = document.getElementById('tweetText');
const tweetButton = document.getElementById('tweetButton');
const dashboard = document.getElementById('dashboard');

// function getTweet(){
//   const xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function() {
//   if (xhr.readyState == 4 && xhr.status == 200) {
//     const tweet = document.createElement('div');
//     const text = document.createTextNode(xhr.response);
//     tweet.appendChild(text);
//     dashboard.appendChild(tweet);
//   }
// };
// xhr.open("GET", "/getTweet", true);
// xhr.send();
// }

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

window.addEventListener('load', getTweet);

tweetButton.addEventListener('click', postTweet);
