function warningCursor() {
  chrome.storage.local.get(['blacklist', 'toggleState'], function(data) {
    if (data.blacklist && data.toggleState === 'On') 
    {

      const isBlacklisted = data.blacklist.some(function(site) {
  
        try {
          const blacklistedURL = new URL(site).hostname;
          return (window.location.hostname === blacklistedURL)
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
function addSound() {
	chrome.storage.local.get(['blacklist', 'toggleState'], function(data) {
		if  (!(data.blacklist && data.toggleState === 'On')) { 
			return;	
		}
		const isBlacklisted = data.blacklist.some(function(site) {
  
			try {
			  const blacklistedURL = new URL(site).hostname;
			  return (window.location.hostname === blacklistedURL)
			}
			catch (error) {
			  return false;
			}
		  
		});

		if (!isBlacklisted)
			return; 
		
		let userInteracted = false;
		document.addEventListener('click', function() {
			userInteracted = true;
		});

		let soundURL = chrome.runtime.getURL("thwomp.mp3")
		console.log(soundURL);
		var audio = new Audio(soundURL);
		document.addEventListener('mouseover',function() {
			if(userInteracted) {
				var audio = new Audio(soundURL);
				audio.play();
			}
		});
	});
}
warningCursor();
addSound();