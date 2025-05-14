// Service worker script for handling background tasks

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "downloadCSV") {
    // Forward to tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, message);
        sendResponse({ success: true });
      }
    });
    return true; // Keep the message channel open
  }
  return true;
});
