
const pages = [
  document.getElementById("homePage"),
  document.getElementById("letterPage"),
  document.getElementById("questionPage"),
  document.getElementById("thanksPage")
];

const heartsBg = document.getElementById("heartsBg");
const envelopeBtn = document.getElementById("envelopeBtn");
const letter = document.getElementById("letter");
const envelopeHint = document.getElementById("envelopeHint");
const response = document.getElementById("response");
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const noBtn = document.getElementById("noBtn");

// Page navigation
function showPage(pageToShow) {
  pages.forEach(page => page.classList.add("hidden"));
  pageToShow.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Open the message
document.getElementById("openBtn").addEventListener("click", () => {
  showPage(pages[1]);
});

// Open the envelope and reveal the letter
envelopeBtn.addEventListener("click", () => {
  envelopeBtn.classList.add("opened");
  envelopeHint.textContent = "Opening your letter... 💗";

  setTimeout(() => {
    envelopeBtn.classList.add("hidden");
    envelopeHint.classList.add("hidden");
    letter.classList.remove("hidden");
  }, 350);
});

// Continue to the forgiveness question
document.getElementById("continueBtn").addEventListener("click", () => {
  showPage(pages[2]);
});

// YES button
document.getElementById("yesBtn").addEventListener("click", () => {
  resetNotYet();
  showPage(pages[3]);
  createHeartBurst();
});

// NOT YET button: show messages around the webpage
const funnyMessages = [
  "Are you sure? 😢",
  "Wait, think again! 🤔",
  "Can't click this! 🙈",
  "Try another button! 😄"
];

let noClickCount = 0;
let isMessageShowing = false;
let messageResetTimer = null;

const floatingMessageLayer = document.createElement("div");
floatingMessageLayer.id = "floatingMessageLayer";
floatingMessageLayer.setAttribute("aria-live", "polite");
document.body.appendChild(floatingMessageLayer);

function showFunnyMessage() {
  if (isMessageShowing || noBtn.disabled) return;

  isMessageShowing = true;

  // Hide the button without changing its text
  noBtn.style.visibility = "hidden";

  const message = document.createElement("div");
  message.className = "floating-apology-message";
  message.textContent =
    funnyMessages[noClickCount % funnyMessages.length];

  floatingMessageLayer.replaceChildren(message);
  noClickCount++;

  // Keep the message within the visible screen
  const margin = 20;
  const halfWidth = message.offsetWidth / 2;
  const halfHeight = message.offsetHeight / 2;

  const minX = margin + halfWidth;
  const maxX = Math.max(minX, window.innerWidth - margin - halfWidth);

  const minY = margin + halfHeight;
  const maxY = Math.max(minY, window.innerHeight - margin - halfHeight);

  const x = minX + Math.random() * (maxX - minX);
  const y = minY + Math.random() * (maxY - minY);

  message.style.left = `${x}px`;
  message.style.top = `${y}px`;

  // Remove the message and restore the button
  clearTimeout(messageResetTimer);

  messageResetTimer = setTimeout(() => {
    floatingMessageLayer.replaceChildren();
    noBtn.style.visibility = "visible";
    isMessageShowing = false;
  }, 3500);
}

// Desktop: mouse approaches the button
noBtn.addEventListener("pointerenter", event => {
  if (event.pointerType === "mouse") {
    showFunnyMessage();
  }
});

// Mobile: tap the button
noBtn.addEventListener("click", event => {
  event.preventDefault();

  if (window.matchMedia("(hover: none)").matches) {
    showFunnyMessage();
  }
});

// Reset the Not Yet behavior
function resetNotYet() {
  clearTimeout(messageResetTimer);

  noClickCount = 0;
  isMessageShowing = false;

  noBtn.textContent = "Not yet 🥺";
  noBtn.style.visibility = "visible";
  noBtn.style.transform = "";

  floatingMessageLayer.replaceChildren();
  response.textContent = "";
}

// Read the letter again
document.getElementById("backBtn").addEventListener("click", () => {
  resetNotYet();
  showPage(pages[1]);
});

// Restart the website
document.getElementById("restartBtn").addEventListener("click", () => {
  resetNotYet();

  letter.classList.add("hidden");
  envelopeBtn.classList.remove("hidden", "opened");
  envelopeHint.classList.remove("hidden");
  envelopeHint.textContent = "Tap the little heart to open";

  showPage(pages[0]);
});

// Floating hearts
const heartSymbols = ["♥", "♡", "💕", "💗"];

function createHeart() {
  const heart = document.createElement("span");
  heart.className = "floating-heart";

  heart.textContent =
    heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

  heart.style.left = Math.random() * 100 + "%";
  heart.style.fontSize = (14 + Math.random() * 22) + "px";
  heart.style.animationDuration = (5 + Math.random() * 5) + "s";

  heartsBg.appendChild(heart);

  heart.addEventListener("animationend", () => {
    heart.remove();
  });
}

setInterval(createHeart, 650);

// Heart celebration
function createHeartBurst() {
  for (let i = 0; i < 20; i++) {
    setTimeout(createHeart, i * 80);
  }
}


/* Background music autoplay */

music.volume = 0.5;

async function startBackgroundMusic() {
  if (!music.paused) return;

  try {
    await music.play();

    musicBtn.textContent = "♫ Music: On";
    musicBtn.setAttribute("aria-label", "Pause background music");
    musicBtn.setAttribute("aria-pressed", "true");
  } catch (error) {
    console.log("Autoplay blocked. Waiting for user interaction.");

    musicBtn.textContent = "♫ Play Music";
    musicBtn.setAttribute("aria-label", "Play background music");
    musicBtn.setAttribute("aria-pressed", "false");
  }
}

// Try to play music as soon as the page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startBackgroundMusic, {
    once: true
  });
} else {
  startBackgroundMusic();
}

// If autoplay is blocked, start music after the first interaction
function playMusicOnFirstInteraction() {
  startBackgroundMusic();

  if (!music.paused) {
    document.removeEventListener("click", playMusicOnFirstInteraction);
    document.removeEventListener("touchstart", playMusicOnFirstInteraction);
    document.removeEventListener("keydown", playMusicOnFirstInteraction);
  }
}

document.addEventListener("click", playMusicOnFirstInteraction);
document.addEventListener("touchstart", playMusicOnFirstInteraction, {
  passive: true
});
document.addEventListener("keydown", playMusicOnFirstInteraction);

// Music button: toggle on/off
musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    await startBackgroundMusic();
  } else {
    music.pause();
    musicBtn.textContent = "♫ Music: Off";
    musicBtn.setAttribute("aria-label", "Play background music");
    musicBtn.setAttribute("aria-pressed", "false");
  }
});

// Keep button text synchronized with playback
music.addEventListener("play", () => {
  musicBtn.textContent = "♫ Music: On";
  musicBtn.setAttribute("aria-pressed", "true");
});

music.addEventListener("pause", () => {
  musicBtn.textContent = "♫ Music: Off";
  musicBtn.setAttribute("aria-pressed", "false");
});
