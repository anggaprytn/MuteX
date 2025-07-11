import { loadWords } from "./shared/words.js";

chrome.runtime.onInstalled.addListener(async () => {
  const words = await loadWords();
  await chrome.storage.local.set({ isEnabled: true, blockedWords: words });
});
