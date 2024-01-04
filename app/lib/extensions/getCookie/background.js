chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getText') {
      let textarea = document.getElementById('yourFbstate');
      sendResponse({text: textarea.value});
    }
  });