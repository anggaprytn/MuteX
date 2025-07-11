import { loadWords } from "./shared/words.js";

let isEnabled = true;
let deleteMode = true;
let blockedWords = [];
let blockedCount = 0;

chrome.storage.local.get(
  ["isEnabled", "deleteMode", "blockedCount"],
  async (r) => {
    isEnabled = r.isEnabled ?? true;
    deleteMode = r.deleteMode ?? true;
    blockedCount = r.blockedCount ?? 0;

    blockedWords = await loadWords();
    startObserver();
  }
);

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleBlocking") {
    isEnabled = message.isEnabled;
    deleteMode = message.deleteMode;
  }
  if (message.action === "updateWords") {
    blockedWords = message.words || blockedWords;
  }
});

// Inject blur CSS
const blurStyle = `
.affiliate-blur-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	backdrop-filter: blur(10px);
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba(0, 0, 0, 0.5);
	cursor: pointer;
}
.affiliate-blur-text {
	color: white;
	font-size: 14px;
	padding: 10px;
	background: rgba(0, 0, 0, 0.7);
	border-radius: 5px;
	text-align: center;
}
`;

const styleTag = document.createElement("style");
styleTag.textContent = blurStyle;
document.head.appendChild(styleTag);

function createBlurOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "affiliate-blur-overlay";

  const text = document.createElement("div");
  text.className = "affiliate-blur-text";
  text.textContent = "Affiliate content detected (click to reveal)";

  overlay.appendChild(text);
  overlay.addEventListener("click", () => overlay.remove());

  return overlay;
}

function createBlurCover() {
  const overlay = document.createElement("div");
  overlay.className = "affiliate-blur-overlay";
  return overlay;
}

function isAffiliateTweet(tweet) {
  const text = tweet.innerText.toLowerCase();
  const links = Array.from(tweet.querySelectorAll("a")).map((a) =>
    a.href.toLowerCase()
  );

  return blockedWords.some((word) => {
    word = word.toLowerCase();
    return text.includes(word) || links.some((href) => href.includes(word));
  });
}

function handleAffiliateTweet(tweet) {
  if (tweet.dataset.affiliateHandled) return;
  tweet.dataset.affiliateHandled = "true";

  const container =
    tweet.closest('[data-testid="tweet"]') || tweet.closest("article");
  if (!container) return;

  container.style.position = "relative";

  const overlay = document.createElement("div");
  overlay.className = "affiliate-blur-overlay";

  const text = document.createElement("div");
  text.className = "affiliate-blur-text";
  text.textContent = "Affiliate content detected (click to reveal)";
  overlay.appendChild(text);

  overlay.addEventListener("click", () => {
    overlay.remove();
    container.style.opacity = "1";
    container.style.filter = "none";
    container.style.pointerEvents = "auto";
  });

  container.appendChild(overlay);
  container.style.opacity = "0.3";
  container.style.filter = "blur(2px) grayscale(100%)";
  container.style.pointerEvents = "none";

  blockedCount++;
  chrome.storage.local.set({ blockedCount });
}

function processTweet(tweet) {
  console.log("Checking tweet1:", tweet.innerText);
  if (!isEnabled) return;
  console.log("Checking tweet2:", tweet.innerText);
  if (isAffiliateTweet(tweet)) handleAffiliateTweet(tweet);
}

function scanAllTweets() {
  document.querySelectorAll("article").forEach(processTweet);
}

const observer = new MutationObserver((mutations) => {
  if (!isEnabled) return;

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tweets = node.querySelectorAll
          ? node.querySelectorAll("article")
          : [];
        tweets.forEach(processTweet);
      }
    });
  });
});

function startObserver() {
  const timeline = document.querySelector("main");
  if (timeline) {
    observer.observe(timeline, { childList: true, subtree: true });
    scanAllTweets();
  } else {
    setTimeout(startObserver, 1000);
  }
}

startObserver();
