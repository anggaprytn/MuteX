// shared/words.js
const WORDS_URL = chrome.runtime.getURL("assets/blocked-words.json");
const DEFAULT = ["s.shopee.co.id", "s.lazada.co.id"]; // hard-fallback

export async function loadWords() {
  // first try cache
  const { blockedWords } = await chrome.storage.local.get("blockedWords");
  if (Array.isArray(blockedWords) && blockedWords.length) return blockedWords;

  // else fetch the bundled JSON
  try {
    const res = await fetch(WORDS_URL);
    const arr = await res.json();
    if (Array.isArray(arr) && arr.length) {
      await chrome.storage.local.set({ blockedWords: arr });
      return arr;
    }
  } catch (_) {
    /* ignore */
  }

  return DEFAULT; // last-ditch
}
