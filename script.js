const card = document.querySelector(".card");

function cardRemove() {
  card.style.opacity = "0";
}

setTimeout(cardRemove, 15000);

var i = 0;
var txt = "I'm available for work!";
var speed = 65;

function typeWriter() {
  if (i < txt.length) {
    document.querySelector(".hiring p").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

typeWriter();

const darkTheme = document.querySelector(".dark-mode");
const moon = document.querySelector(".moon");
const sun = document.querySelector(".sun");

let isDarkMode = localStorage.getItem("darkMode") === "true";

function updateTheme() {
  sun.classList.toggle("none", !isDarkMode);
  moon.classList.toggle("none", isDarkMode);
  document.body.classList.toggle("dark", isDarkMode);

  let githubElement = document.querySelector(".github");
  let instagramElement = document.querySelector(".instagram");
  let linkedinElement = document.querySelector(".linkedin");
  let xElement = document.querySelector(".x");

  if (isDarkMode) {
    githubElement.setAttribute("src", "/img/dark-github-line.svg");
    instagramElement.setAttribute("src", "/img/dark-instagram-line.svg");
    linkedinElement.setAttribute("src", "/img/dark-linkedin-box-line.svg");
    xElement.setAttribute("src", "/img/dark-twitter-x-line.svg");
  } else {
    githubElement.setAttribute("src", "/img/github-line.svg");
    instagramElement.setAttribute("src", "/img/instagram-line.svg");
    linkedinElement.setAttribute("src", "/img/linkedin-box-line.svg");
    xElement.setAttribute("src", "/img/twitter-x-line.svg");
  }
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem("darkMode", isDarkMode.toString());
  updateTheme();
}

document.addEventListener("DOMContentLoaded", updateTheme);
darkTheme.addEventListener("click", toggleTheme);

// xd
console.warn(
  "probably someone is looking for the codes / sanırım kodları arıyorsun?!"
);
