chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    isEnabled: true,
    blockedWords: ["shope.ee", "s.shopee.co.id", "spf.shopee.co.id"],
  });
});
