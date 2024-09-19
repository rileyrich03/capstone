function blacklistLoop() {
	chrome.storage.local.get(['blacklist', 'toggleState'], function(data) {
	  if (!(data.blacklist && data.toggleState === 'On')) 
		return;
	  //prevents from running on non-blacklisted sites.
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
	  if (!document.hasFocus())
		return;
	
	  function warningCursor() {
		  document.documentElement.style.cursor = 
			`url('${chrome.runtime.getURL('cursor.png')}'), default`;
	  }
	  function createPopupWindow() {
		pageSelect = Math.floor(Math.random() * 3);
		pageURL = ("spam" + pageSelect + ".html");
		pageURL = chrome.runtime.getURL(pageURL);
		locationX1 = Math.floor(Math.random() * 600);
		locationY1 = Math.floor(Math.random() * 600);
		newwindow1=window.open(pageURL,'name0','height=250,width=200,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
		newwindow1.moveBy(locationX1, locationY1);
	
		pageSelect = Math.floor(Math.random() * 3);
		pageURL = ("spam" + pageSelect + ".html");
		pageURL = chrome.runtime.getURL(pageURL);
		locationX2 = Math.floor(Math.random() * 600);
		locationY2 = Math.floor(Math.random() * 600);
		newwindow2=window.open(pageURL,'name1','height=250,width=200,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
		newwindow2.moveBy(locationX2, locationY2);
		
		pageSelect = Math.floor(Math.random() * 3);
		pageURL = ("spam" + pageSelect + ".html");
		pageURL = chrome.runtime.getURL(pageURL);
		locationX3 = Math.floor(Math.random() * 600);
		locationY3 = Math.floor(Math.random() * 600);
		newwindow3=window.open(pageURL,'name2','height=250,width=200,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
		newwindow3.moveBy(locationX3, locationY3);	
	  }
	  function addSound() {
		let soundURL = chrome.runtime.getURL("thwomp.mp3")
		console.log(soundURL);
		var audio = new Audio(soundURL);
		let userInteracted = false;
		
		//enables sound to be played after user interacts with page
		document.addEventListener('click', function() {
	  	userInteracted = true;
		});

		//plays sound when mouse moves
		document.addEventListener('mouseover',function() {
	  	  if(userInteracted) {
	      var audio = new Audio(soundURL);
		  audio.play();
		  }
	    });
	  }
	  warningCursor();
	  addSound();
	  createPopupWindow();
  });
}

setInterval(blacklistLoop, 5000);