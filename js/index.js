const countdownTime = "15"  // Timer length in minutes
let currentFlag = 0;
let score = 0;
let ended = false;
let counter;
let lang;

let storedData = "";

let order = [];

function setup() {
  document.getElementById("div_content").style.visibility = "hidden";
  document.getElementById("p_clock").innerHTML = countdownTime + ":00";
}

function startQuiz() {
  document.getElementById("div_content").style.visibility = "visible";
  lang = document.getElementById("radio_eng").checked;

  let button = document.getElementById("btn_start");
  if (lang) button.innerHTML = "Give up";
  else button.innerHTML = "Gi opp";
  button.setAttribute("onclick", "endGame()");

  generateNumberArray();
  getFlag();
  startCountdown();
  updateScore(0);
}

function getFlag() {
  document.getElementById("img_flag").src = "https://www.countryflags.io/" + countriesV2[order[currentFlag][0]][0] + "/flat/64.png";
  document.getElementById("input_countryName").value = "";
}

function newFlag() {
  currentFlag++;
  if (currentFlag > order.length - 1) currentFlag = 0;
  if (order[currentFlag][1] != 0) newFlag();
  else getFlag();
}

function updateScore(amount) {
  score += amount;
  document.getElementById("p_score").innerHTML = score + " / " + (countriesV2.length);
  if(score == countriesV2.length) endGame();
}

function feedback(status) {
  let = box = document.getElementById("div_content");
  if (status == "correct") {
    box.style.backgroundColor = "lightgreen";
    order[currentFlag][1] = 1;
    setTimeout(function() {
      box.style.backgroundColor = "";
    }, 500);
  }
  else if (status == "wrong") {
    box.style.backgroundColor = "red";
    order[currentFlag][1] = 2;
    order[currentFlag][2] = document.getElementById("input_countryName").value;
    setTimeout(function() {
      box.style.backgroundColor = "";
    }, 500);
  }
}

function createBox(index, lang, res) {
  let div = document.createElement("div");
  div.setAttribute("class", "resultCountriesDiv");
  let name;
  let guess;

  let img = document.createElement("img");
  img.setAttribute("class", "resultFlag");
  img.setAttribute("src", "https://www.countryflags.io/" + countriesV2[order[index][0]][0] + "/flat/64.png");

  let textDiv = document.createElement("div");
  textDiv.setAttribute("class", "resultText");

  if (order[index].length == 3) {
    name = document.createTextNode("Name: " + countriesV2[order[index][0]][lang]);
    guess = document.createTextNode("Guess: " + order[index][2]);
  }
  else {
    name = document.createTextNode("Name: " + countriesV2[order[index][0]][lang]);
    guess = document.createTextNode("No guess");
  }

  let br = document.createElement("br");
  textDiv.appendChild(name);
  textDiv.appendChild(br);
  textDiv.appendChild(guess);

  div.appendChild(img);
  div.appendChild(textDiv);

  res.appendChild(div);
}

function endGame() {
  let button = document.getElementById("btn_start");
  button.style.visibility = "hidden";

  clearTimeout(counter);
  // document.getElementById("div_content").style.visibility = "hidden";
  document.getElementById("div_content").remove();
  let res = document.getElementById("div_results");
  let i = 0;
  while(i < countriesV2.length) {
    if (order[i][1] == 2 || order[i][1] == 0) {
      if (lang) {
        createBox(i, 1, res)
      }
      else {
        if (countriesV2[order[i][0]].length > 2) {
          createBox(i, 2, res);
        }
        else {
          createBox(i, 1, res);
        }
      }
    }
    i++;
  }
}

function startCountdown() {
  let seconds = countdownTime * 60;
  let clock = document.getElementById("p_clock");
  counter = setInterval(function() {
    if (!ended) {
      seconds--;
      let m = Math.floor(seconds / 60);
      let s = seconds % 60;

      if (s > 9) clock.innerHTML = m + ":" + s;
      else clock.innerHTML = m + ":0" + s;

      if (seconds <= 0) endGame();
    }
  }, 1000);
}

function generateNumberArray(length) {
  for (let i = 0; i < countriesV2.length; i++) {
    order.push([i, 0]);
  }
  let m = countriesV2.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = order[m];
    order[m] = order[i];
    order[i] = t;
  }
}

let countryInput = document.getElementById("input_countryName");
countryInput.addEventListener("keyup", function(event) {
  if(event.keyCode === 13) {
    event.preventDefault();
    if (countryInput.value == "") {
      newFlag();
    }
    else {
      let found = false;
      let n = 0;
      for (let i = 1; i < countriesV2[order[currentFlag][0]].length; i++) {
        if(countryInput.value.toLowerCase() == countriesV2[order[currentFlag][0]][i]) {
          n++;
        }

        if(n > 0) {
          found = true;
        }
      }
      if(found) {
        feedback("correct");
        updateScore(1);
        newFlag();
      }
      else {
        feedback("wrong");
        newFlag();
      }
    }
  }
});

function tester() {
  var text = '{ "employees" : [' +
'{ "firstName":"John" , "lastName":"Doe" },' +
'{ "firstName":"Anna" , "lastName":"Smith" },' +
'{ "firstName":"Peter" , "lastName":"Jones" } ]}';
  console.log(text);
  console.log(JSON.parse(text));
}

function fileTest() {
  let n = 1;
  console.log("TEST BUTTON CLICKED");
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState = 4 && this.status == 200) {
      alert(this.responseText);
    }
    else {
      alert("NO RESPONSE");
    }
  }
  xhr.open("GET", "/php/request_attempt.php?q=" + n, true);
  xhr.send();
}

function getFile() {
  let file = "data.json";
  xhr = new XMLHttpRequest();
  xhr.open("GET", "http://folk.ntnu.no/jorgejae/flagg/" + file, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState = 4 && (xhr.status >= 200 && xhr.status < 400)) {
      storedData = JSON.parse(xhr.responseText);
      console.log(storedData.attempts.started);
      updateFile();
    }
  }
}

function updateFile() {
  if (storedData != "") {
    let a = storedData.attempts.started;
    a++;
    storedData.attempts.started = a;
  }
}

function sendFile() {
  let file = "data.json";
  xhr = new XMLHttpRequest();
  xhr.open("POST", "http://folk.ntnu.no/jorgejae/flagg/" + file);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(storedData));
}

setup();
