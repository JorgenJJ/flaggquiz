let countdownTime = "15"  // Timer length in minutes
let currentFlag = 0;
let score = 0;
let ended = false;
let counter;
let lang;
let diff;
let lives = 3;
let isOnMobile = false;
let left = 197;

let dupes = [0, 0];

let storedData = "";

let order = [];

function setup() {
  document.getElementById("div_content").style.visibility = "hidden";
  document.getElementById("p_clock").innerHTML = countdownTime + ":00";
  radioClick(document.getElementsByClassName("btnLanguage")[1]);
  radioClick(document.getElementsByClassName("btnDifficulty")[1]);
}

function startQuiz() {
  document.getElementById("div_content").style.visibility = "visible";

  if (document.getElementById("div_keyboard") != null) {
    //document.getElementById("div_keyboard").style.visibility = "visible";
    document.getElementById("input_countryName").focus();
    document.getElementById("footer").style.height = "40vw";
    document.getElementById("footer").style.top = "20vw";
    document.getElementsByClassName("controlPanel")[0].style.visibility = "hidden";
    document.getElementsByClassName("controlPanel")[0].style.height = "0%";
    document.getElementById("btn_giveup").style.visibility = "visible";
  }
  let button = document.getElementById("btn_start");
  if (lang) button.innerHTML = "Give up";
  else button.innerHTML = "Gi opp";
  button.setAttribute("onclick", "endGame()");

  for (let i = 0; i < lives; i++) {
    let life = document.createElement("div");
    life.setAttribute("class", "lifeDiv");
    life.setAttribute("id", "life" + i);
    document.getElementById("livesDiv").appendChild(life);
  }

  generateNumberArray();
  getFlag();
  startCountdown();
  updateScore(0);
}

function getFlag() {
  //document.getElementById("img_flag").src = "https://www.countryflags.io/" + countriesV2[order[currentFlag][0]][0] + "/flat/64.png";
  document.getElementById("img_flag").src = "images/flags/" + countriesV2[order[currentFlag][0]][0] + ".svg";
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
  let box = document.getElementById("container");
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
  img.setAttribute("src", "images/flags/" + countriesV2[order[index][0]][0] + ".svg");

  let textDiv = document.createElement("div");
  textDiv.setAttribute("class", "resultText");

  if (order[index].length == 3) {
    name = document.createTextNode("Navn: " + countriesV2[order[index][0]][lang]);
    guess = document.createTextNode("Gjett: " + order[index][2]);
  }
  else {
    name = document.createTextNode("Navn: " + countriesV2[order[index][0]][lang]);
    guess = document.createTextNode("Ingen forsøk");
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

  if (document.getElementById("div_keyboard") != null) {
    document.getElementById("div_keyboard").style.visibility = "hidden";
    document.getElementById("livesDiv").style.visibility = "hidden";
    document.getElementById("livesDiv").style.height = "0px";
    document.getElementById("flagContainer").style.visibility = "hidden";
    document.getElementById("flagContainer").style.height = "0px";
  }
  else {
    document.getElementById("div_content").remove();
  }

  clearTimeout(counter);
  // document.getElementById("div_content").style.visibility = "hidden";
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
    checkAnswer();
  }
});

function checkAnswer() {
  let a = "";
  if (countryInput.value == "") {
    newFlag();
  }
  else {
    if (countryInput.value.substr(-1) == " ") {
      a = countryInput.value.slice(0, -1);
    }
    else a = countryInput.value;
    a = a.toLocaleLowerCase();
    let found = false;
    let n = 0;
    for (let i = 1; i < countriesV2[order[currentFlag][0]].length; i++) {
      let cur = countriesV2[order[currentFlag][0]][i];
      if(a == cur) {
        n++;
      }
      else if ((a == "monaco" || a == "indonesia") && (cur == "monaco" || cur == "indonesia")) {
        n++;
      }
      else if ((a == "romania" || a == "chad") && (cur == "romania" || cur == "chad")) {
        n++;
      }

      if(n > 0) {
        found = true;
      }
    }
    if(found) {
      feedback("correct");
      updateScore(1);      
      left--;
      if (left == 0) endGame();
      newFlag();
    }
    else {
      if (lives > 0) {
        lives--;
        console.log("IS HERE");
        document.getElementById("life" + lives).setAttribute("style", "background-color: transparent");
      }
      else {
        feedback("wrong");
        left--;
        if (left == 0) endGame();
        newFlag();
      }
    }
  }
}

function handleDuplicates(country) {
  if ((country == "ro" || "sg") && dupes[0] == 0) {
    dupes[0] = 1;
    return true;
  }
  else if ((country == "ro" || "sg") && dupes[0] == 1) {
    if (country == "ro") {
      return true;
    }
    else if (country == "sg") {
      return true;
    }
    else return false;
  }
  else if ((country == "id" || "mc") && dupes[1] == 0) {
    dupes[1] = 1;
    return true;
  }
  else if ((country == "id" || "mc") && dupes[1] == 1) {
    if (country == "id") {
      return true;
    }
    else if (country == "mc") {
      return true;
    }
    else return false;
  }
  else return false;
}

$(document).ready(function(){
  $('input[type=radio]').click(function(){
    if (document.getElementById("radio_easy").checked) diff = 0;
    else if (document.getElementById("radio_hard").checked) diff = 2;
    else diff = 1;

    if (diff == 0) {
      countdownTime = "20";
      lives = 5;
    }
    else if (diff == 2) {
      countdownTime = "12";
      lives = 0;
    }
    else {
      countdownTime = "15";
      lives = 3;
    }

    document.getElementById("p_clock").innerHTML = countdownTime + ":00";
  });
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
      alert(JSON.parse(this.responseText));
    }
    else {
      alert(this.status);
    }
  }
  xhr.open("GET", "php/request_attempt.php?q=" + n, true);
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

// from detectmobilebrowsers.com
window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function keyboardClick(elem) {
  let inp = document.getElementById("input_countryName");
  if (elem.innerHTML == "SPACE") inp.value = inp.value + " ";
  else if (elem.innerHTML == "&lt;") inp.value = inp.value.slice(0, -1);
  else if (elem.innerHTML == "OK") checkAnswer();
  else inp.value = inp.value + elem.innerHTML;
}

function radioClick(elem) {
  if (elem.id == "l") {
    if (elem.innerHTML == "English") {
      lang = true;
      setRadioStyle(elem, "btnLanguage", "#5E8C61");
    }
    else if (elem.innerHTML == "Norsk") {
      lang = false;
      setRadioStyle(elem, "btnLanguage", "#5E8C61");
    }
  }
  else if (elem.id == "d") {
    if (elem.innerHTML == "Lett") {
      diff = 0;
      setRadioStyle(elem, "btnDifficulty", "#5E8C61");
    }
    else if (elem.innerHTML == "Middels") {
      diff = 1;
      setRadioStyle(elem, "btnDifficulty", "#5E8C61");
    }
    else if (elem.innerHTML == "Vanskelig") {
      diff = 2;
      setRadioStyle(elem, "btnDifficulty", "#5E8C61");
    }
    if (diff == 0) {
      countdownTime = "20";
      lives = 5;
    }
    else if (diff == 2) {
      countdownTime = "12";
      lives = 0;
    }
    else {
      countdownTime = "15";
      lives = 3;
    }

    document.getElementById("p_clock").innerHTML = countdownTime + ":00";
  }
}

function setRadioStyle(element, btnClass, clr) {
  let btns = document.getElementsByClassName(btnClass);
  for (let i = 0; i < btns.length; i++) {
    btns[i].style.backgroundColor = "";
  }
  element.style.backgroundColor = clr;
}

setup();
