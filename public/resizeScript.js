  function iframeLoaded() {
    var iFrameID = document.getElementById('iFrame1');
    if(iFrameID) {
      iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + 50 + "px";
      }   
  }
