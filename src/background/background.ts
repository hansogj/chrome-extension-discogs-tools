const isThisBackground = true;
console.log('isThisBackground', isThisBackground);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' });
});
