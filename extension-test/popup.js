function warningCursor() {
  chrome.storage.local.get(['blacklist', 'toggleState'], function(data) {
    if (data.blacklist && data.toggleState === 'On') 
    {

      const isBlacklisted = data.blacklist.some(function(site) {
  
        try {
          const blacklistedURL = new URL(site).hostname;
          if (window.location.hostname === blacklistedURL) {
            return true;
          }
          else {
            return false;
          }          
        } 
        catch (error) {
          return false;
        }
      
      });
      
      if (isBlacklisted == true) {

        document.documentElement.style.cursor = 
        `url('${chrome.runtime.getURL('cursor.png')}'), default`;
      }

/*       
let currentURL = (window.location.href.replace(/\/+$/, ""));

      data.blacklist.forEach(function(site)
      {
          let blacklistedURL = site.replace(/\/+$/, "");

          if (currentURL.startsWith(blacklistedURL)) {

              let hugeBlueDiv = document.createElement('div');

              document.body.style.color = "blue";
              document.body.style.backgroundColor = "blue";
              hugeBlueDiv.style.backgroundColor = "blue";

              hugeBlueDiv.style.width = "100%";
              hugeBlueDiv.style.height = "100%";

              hugeBlueDiv.style.position = "fixed";
              hugeBlueDiv.style.top = "0";
              hugeBlueDiv.style.left = "0";

              document.body.appendChild(hugeBlueDiv);
          } 
  */

    }
  });
}

warningCursor();
