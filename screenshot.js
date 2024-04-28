function captureScreenshotAndCopyToClipboard() {
  chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(dataUrl) {
    if (chrome.runtime.lastError) {
      console.error('Error capturing the visible tab: ' + chrome.runtime.lastError.message);
      return;
    }

    // Create an image element
    var img = new Image();
    img.onload = function() {
      // Create a canvas and draw the image onto it to convert the image to a Blob
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Convert canvas to blob
      canvas.toBlob(function(blob) {
        // Copy the image blob to the clipboard
        navigator.clipboard.write([
          new ClipboardItem({'image/png': blob})
        ]).then(() => {
          console.log('Screenshot copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy screenshot to clipboard: ', err);
        });
      }, 'image/png');
    };
    img.src = dataUrl;
  });
}

// Add a listener to your extension, e.g., button click in popup.html or a command
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'captureScreenshot') {
    captureScreenshotAndCopyToClipboard();
    sendResponse({status: 'Processing screenshot...'});
  }
});
