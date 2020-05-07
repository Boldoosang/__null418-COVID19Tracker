  function iframeLoaded() {
    let iFrameID = document.getElementById('iFrame1'); //load iframe into object
    if(iFrameID) {
      iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + 250 + "px"; //change the iframe height to the total size of the inner page
      }   
  } 
