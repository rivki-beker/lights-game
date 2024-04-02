//--------------------log-in-----------------------------------
logIn();
function logIn() {
    document.getElementById("login").addEventListener("click", () => document.getElementById("log-in-music").play())//הפעלת מוזיקה
    const userDetails = { userName: "", password: "" };//מאתחלים את פרטי משתמש ברירת מחדל
    localStorage.setItem(JSON.stringify(userDetails), 0);
    document.getElementById("login").style.display = 'flex';//הלוג-אין מוצג
    var inputs = document.querySelectorAll("form input");
    inputs[0].addEventListener("blur", checkValidation);//הוספת אירוע - ולידציה
    inputs[1].addEventListener("blur", checkValidation);
    document.querySelector("form").addEventListener("submit", () => { //הוספת אירוע בעת שליחה
        displayNone("login");//מסתיר את הלוג-אין 
        document.getElementById("out").style.display = "block";//הצגת טעינת המשחק
        setTimeout("start()", 2000);//התחלת המשחק בעוד שתי שניות כולל מוזיקה
        document.getElementById("log-in-music").pause();
        document.getElementById("game-process-music").play();
    });
}
function checkValidation() {//בדיקת תקינות אין אפשרות להכניס רק שם או סיסמה
    let password = document.querySelector("form input[type=password]");
    let name = document.querySelector("form input[type=text]");
    if (name.value != "" & password.value == "") {
        password.setCustomValidity("you must enter a password or delete your name");
    }
    else if (name.value == "" & password.value != "") {
        name.setCustomValidity("you must enter your name or delete password");
    }
    else {
        name.setCustomValidity("");
        password.setCustomValidity("");
    }
}
function displayNone(elementId) {//הסתרת הלוג-אין או התוצאות לפי השליחה
    document.querySelector("#" + elementId + "> :first-child").classList.add("smallAnimate");
    setTimeout(() => document.getElementById(elementId).style.display = 'none', 200);
    setTimeout(() => document.querySelector("#" + elementId + "> :first-child").classList.remove("smallAnimate"), 300);
}
//--------------------game-------------------------------------
let score, time, games, victories, timerOn;
const arr = document.querySelectorAll("img"), arrLights = [arr.length], arrPlayer = [arr.length];
for (let index = 1; index <= arr.length; index++) {
    document.getElementById(index).addEventListener("click", userLight);//הוספת אירוע לכל החלונות
}
function start() {
    document.getElementById("out").style.display = "none";//מפסיק את הטעינה
    init();//איתחול
    timerOn = setInterval("timer()", 1000);//הפעלת הטיימר
    lightOn();//הפעלת הפונקציה שמדליקה את החלונות
}
function init() {//אתחול הערכים
    document.getElementById("timer").style.color = "rgb(255, 213, 61)";
    document.getElementById("timer").innerHTML = "01:00";
    score = 0;
    time = 59;
    games = 0;
    victories = 0;
    for (let index = 1; index <= arr.length; index++) {
        arrLights[index] = 0;
        arrPlayer[index] = 0;
    }
}
function timer() {
    if (time >= 10)
        document.getElementById("timer").innerHTML = "00:" + time;
    else if (time >= 0) {
        document.getElementById("timer").innerHTML = "00:0" + time;
        document.getElementById("timer").style.color = "red";
    }
    else
        finish();
    time--;
}
function lightOn() {
    clearInterval(timerOn);//מפסיק את הטיימר
    document.getElementById("timer").removeAttribute("class");
    let numOfLights = score / 15 + 3, rand;
    for (let index = 0; index < numOfLights; index++) {//מדליקה אורות בצורה אקראית
        rand = Math.floor(Math.random() * arr.length) + 1;
        while (arrLights[rand] == 1)
            rand = Math.floor(Math.random() * arr.length) + 1;
        arrLights[rand] = 1;
        document.getElementById(rand).src = "images/on.jpg";
    }
    setTimeout("clear()", numOfLights * 1200 / document.querySelector("form select").value);//(כיבוי אורות בעוד זמן מסוים (לפי מספר האורות והרמה
}
let checkOn;
function clear() {//פונקציה שמכבה את האורות
    timerOn = setInterval("timer()", 1000);
    document.getElementById("timer").setAttribute("class", "light");
    games++;
    for (let index = 1; index <= arr.length; index++) {
        document.getElementById(index).src = "images/off.jpg";
    }
    //שולח לבדיקה בעוד זמן מסוים אם לא נגמר הזמן מוריד אוטומטית חמש נקודות ומפעיל את פונקצית סיום שלב
    checkOn = setTimeout(()=>{score -= 5; endStage();}, 5000 + score * 120 / document.querySelector("form select").value);
}

function userLight() {//מדליק או מכבה בכל לחיצה
    if (arrPlayer[event.target.id] == 0) {
        event.target.src = "images/on.jpg";
        arrPlayer[event.target.id] = 1;
    }
    else {
        event.target.src = "images/off.jpg";
        arrPlayer[event.target.id] = 0;
    }
    //אם המשתמש גמר להקיש נכונה אז הוא עובר לניסיון הבא
    let index = 1;
    for (; index < arrPlayer.length; index++) {
        if (arrPlayer[index] != arrLights[index])
            break;
    }
    if (index == arrPlayer.length) {
        score += 10;//עדכון הנקודות
        victories++;//עדכון הנצחונות
        clearTimeout(checkOn);//מניעת הבדיקה האוטמטית כשנגמר הזמן
        setTimeout("endStage()", 200);//מציג לשניה את החלון האחרון שנדלק כדי שהמשתמש יראה את התוצאה של הלחיצה
    }
}

function endStage() {//סיום שלב - מכבה את האורות
    for (let index = 1; index <= arr.length; index++) {
        document.getElementById(index).src = "images/off.jpg";
        arrPlayer[index] = 0;
        arrLights[index] = 0;
    }
    if (time > 0)
        lightOn();
}
function finish() {
    document.getElementById("game-process-music").load();
    document.getElementById("result-music").play();
    clearInterval(timerOn);//מפסיק את הטיימר
    document.getElementById("timer").innerHTML = "";//מסתיר את הטיימר
    document.getElementById("results").style.display = "flex";//הצגת התוצאות
    document.querySelector("#results button").addEventListener("click", () => {//הוסת אירוע בעת לחיצה על התחלת המשחק מחדש
        displayNone("results");
        document.getElementById("out").style.display = "block";
        setTimeout("start()", 2000);
        document.getElementById("result-music").load();
        document.getElementById("game-process-music").play();
    });
    //מציג את התוצאות ומעדכן את האיחסון המקומי
    document.getElementById("scores").innerHTML = score;
    document.getElementById("victories").innerHTML = victories + "/" + games;
    let currentUserName = document.querySelector("form input[type=text]").value;
    let currentPassword = document.querySelector("form input[type=password]").value;
    let userDetails = JSON.stringify({ userName: currentUserName, password: currentPassword });
    if (!localStorage.getItem(userDetails) || localStorage.getItem(userDetails) < score)
        localStorage.setItem(userDetails, score);
    if (!localStorage.getItem("maxUsersScore") || localStorage.getItem("maxUsersScore") < score) {
        localStorage.setItem("maxUsersScore", score);
        localStorage.setItem("maxUsersScoreName", document.querySelector("form input[type=text]").value);
    }
    document.getElementById("peak").innerHTML = localStorage.getItem(userDetails);
    document.getElementById("generalPeak").innerHTML = localStorage.getItem("maxUsersScore");
    let peakGamer = localStorage.getItem("maxUsersScoreName");
    if (peakGamer == "")
        peakGamer = "anonymous";
    else if (peakGamer == document.querySelector("form input[type=text]").value)
        peakGamer = "you";
    document.getElementById("peakGamer").innerHTML = peakGamer;
}