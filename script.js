document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("welcome-screen").style.display = "block";
});

function goToScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.style.display = "none";
    });
    document.getElementById(screenId).style.display = "block";
}

let responses = {};

function startSurvey() {
    const nameInput = document.getElementById("user-name").value.trim();
    if (nameInput === "") {
        alert("Please enter your name.");
        return;
    }
    responses["name"] = nameInput;
    document.getElementById("greeting").innerText = `Hey ${nameInput},❗❗`;
    goToScreen("survey-screen");
}

function nextQuestion(question, answer) {
    responses[question] = answer;
    highlightSelectedButton(question, answer);
}

function highlightSelectedButton(question, answer) {
    const buttons = document.querySelectorAll(`#${question}-question ~ button`);
    buttons.forEach(button => {
        button.classList.remove('selected');
    });
    const selectedButton = document.getElementById(`${question}-${answer.toLowerCase()}`);
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
}

function updatePicnicScore(value) {
    document.getElementById("picnic-score").innerText = value;
    responses["picnicRating"] = value;
}

function updateExcitementScore(value) {
    document.getElementById("excitement-score").innerText = value;
    responses["excitement"] = value;
}

function submitResponses() {
    console.log("Submitting responses...");
    const spinner = document.getElementById("loading-spinner");
    const blurOverlay = document.getElementById("blur-overlay");
    const finishBtn = document.querySelector(".finish-btn");

    spinner.classList.remove("hidden");
    blurOverlay.classList.remove("hidden");
    finishBtn.disabled = true;
    finishBtn.style.opacity = "0.5";

    responses["favMovie"] = document.getElementById("fav-movie").value.trim();
    responses["favFood"] = document.getElementById("fav-food").value.trim();

    const formData = new FormData();
    for (let key in responses) {
        formData.append(key, responses[key]);
    }
    console.log("FormData:", Object.fromEntries(formData));

    const url = "https://script.google.com/macros/s/AKfycbxNQKZJredPI1vMhS_1byEeRy9Vqqfmkntw7R5ELhPKIeap8GZsZyNqyZT9oVBjEm2G1w/exec";

    fetch(url, {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Server response:", data);
        spinner.classList.add("hidden");
        blurOverlay.classList.add("hidden");
        finishBtn.disabled = false;
        finishBtn.style.opacity = "1";
        if (data.result === "success") {
            goToScreen("thank-you-screen");
        } else {
            throw new Error(data.error || "Unknown error from server");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        spinner.classList.add("hidden");
        blurOverlay.classList.add("hidden");
        finishBtn.disabled = false;
        finishBtn.style.opacity = "1";
        alert("There was an error submitting your responses. Please try again.");
    });
}