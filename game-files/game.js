//--------------------log-in-----------------------------------
logIn();
function logIn() {
    document.getElementById("login").addEventListener("click", () => document.getElementById("log-in-music").play()) // Play music
    const userDetails = { userName: "", password: "" }; // Initialize default user details
    localStorage.setItem(JSON.stringify(userDetails), 0);
    document.getElementById("login").style.display = 'flex'; // Display the login screen
    var inputs = document.querySelectorAll("form input");
    inputs[0].addEventListener("blur", checkValidation); // Add validation event
    inputs[1].addEventListener("blur", checkValidation);
    document.querySelector("form").addEventListener("submit", () => { // Add event on submit
        displayNone("login"); // Hide the login screen
        document.getElementById("out").style.display = "block"; // Display game loading
        setTimeout("start()", 2000); // Start the game in two seconds with music
        document.getElementById("log-in-music").pause();
        document.getElementById("game-process-music").play();
    });
}

function checkValidation() { // Validation check - both fields must be filled or empty
    let password = document.querySelector("form input[type=password]");
    let name = document.querySelector("form input[type=text]");
    if (name.value != "" && password.value == "") {
        password.setCustomValidity("you must enter a password or delete your name");
    }
    else if (name.value == "" && password.value != "") {
        name.setCustomValidity("you must enter your name or delete password");
    }
    else {
        name.setCustomValidity("");
        password.setCustomValidity("");
    }
}

function displayNone(elementId) { // Hide login or results after submission
    document.querySelector("#" + elementId + "> :first-child").classList.add("smallAnimate");
    setTimeout(() => document.getElementById(elementId).style.display = 'none', 200);
    setTimeout(() => document.querySelector("#" + elementId + "> :first-child").classList.remove("smallAnimate"), 300);
}

//--------------------game-------------------------------------
let score, time, games, victories, timerOn;
const arr = document.querySelectorAll("img"), arrLights = [arr.length], arrPlayer = [arr.length];
for (let index = 1; index <= arr.length; index++) {
    document.getElementById(index).addEventListener("click", userLight); // Add event to all windows
}

function start() {
    document.getElementById("out").style.display = "none"; // Stop loading
    init(); // Initialize
    timerOn = setInterval("timer()", 1000); // Start the timer
    lightOn(); // Call the function that turns on the lights
}

function init() { // Initialize values
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
    clearInterval(timerOn); // Stop the timer
    document.getElementById("timer").removeAttribute("class");
    let numOfLights = score / 15 + 3, rand;
    for (let index = 0; index < numOfLights; index++) { // Turn on lights randomly
        rand = Math.floor(Math.random() * arr.length) + 1;
        while (arrLights[rand] == 1)
            rand = Math.floor(Math.random() * arr.length) + 1;
        arrLights[rand] = 1;
        document.getElementById(rand).src = "images/on.jpg";
    }
    setTimeout("clear()", numOfLights * 1200 / document.querySelector("form select").value); // Turn off lights after a certain time (based on the number of lights and level)
}

let checkOn;

function clear() { // Function that turns off the lights
    timerOn = setInterval("timer()", 1000);
    document.getElementById("timer").setAttribute("class", "light");
    games++;
    for (let index = 1; index <= arr.length; index++) {
        document.getElementById(index).src = "images/off.jpg";
    }
    // Check automatically if time hasn't run out, deduct 5 points, and end the stage
    checkOn = setTimeout(() => { score -= 5; endStage(); }, 5000 + score * 120 / document.querySelector("form select").value);
}

function userLight() { // Toggle lights on or off with each click
    if (arrPlayer[event.target.id] == 0) {
        event.target.src = "images/on.jpg";
        arrPlayer[event.target.id] = 1;
    }
    else {
        event.target.src = "images/off.jpg";
        arrPlayer[event.target.id] = 0;
    }
    // If the user finishes correctly, they move on to the next attempt
    let index = 1;
    for (; index < arrPlayer.length; index++) {
        if (arrPlayer[index] != arrLights[index])
            break;
    }
    if (index == arrPlayer.length) {
        score += 10; // Update score
        victories++; // Update victories
        clearTimeout(checkOn); // Prevent automatic check when time runs out
        setTimeout("endStage()", 200); // Briefly display the last lit window so the user can see the result
    }
}

function endStage() { // End of stage - turn off the lights
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
    clearInterval(timerOn); // Stop the timer
    document.getElementById("timer").innerHTML = ""; // Hide the timer
    document.getElementById("results").style.display = "flex"; // Display the results
    document.querySelector("#results button").addEventListener("click", () => { // Add event when clicking on restart game
        displayNone("results");
        document.getElementById("out").style.display = "block";
        setTimeout("start()", 2000);
        document.getElementById("result-music").load();
        document.getElementById("game-process-music").play();
    });
    // Display results and update local storage
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
