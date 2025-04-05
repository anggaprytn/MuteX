const toggle = document.getElementById("toggle");
const wordList = document.getElementById("wordList");
const deleteToggle = document.getElementById("deleteMode");
const saveBtn = document.getElementById("saveBtn");

chrome.storage.local.get(
  ["isEnabled", "deleteMode", "blockedWords"],
  (result) => {
    toggle.checked = result.isEnabled !== false;
    deleteToggle.checked = result.deleteMode !== false;
    wordList.value = (result.blockedWords || []).join(", ");
  }
);

saveBtn.onclick = () => {
  const words = wordList.value
    .split(",")
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

  const settings = {
    isEnabled: toggle.checked,
    deleteMode: deleteToggle.checked,
    blockedWords: words,
  };

  chrome.storage.local.set(settings);
  chrome.runtime.sendMessage({ action: "toggleBlocking", ...settings });
  chrome.runtime.sendMessage({ action: "updateWords", words });
};
