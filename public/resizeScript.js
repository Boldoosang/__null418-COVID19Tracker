  function iframeLoaded() {
    var iFrameID = document.getElementById('iFrame1'); //load iframe into object
    if(iFrameID) {
      iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + 50 + "px"; //change the iframe height to the total size of the inner page
      }   
  }
