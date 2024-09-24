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
			`url('${chrome.runtime.getURL("cursor.png")}'), default`;
	  }
	  //do not use instead use fakeWindow()
	  function createPopupWindow() {
		newwindow = [];
		for (i = 0; i < 3; i++) {
		  pageSelect = Math.floor(Math.random() * 3);
		  pageURL = ("spam" + pageSelect + ".html");
		  pageURL = chrome.runtime.getURL(pageURL);
		  locationX = Math.floor(Math.random() * 600);
		  locationY = Math.floor(Math.random() * 600);
		  newwindow[i]=window.open(pageURL,'name' + i,'height=250,width=200,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
		  newwindow[i].moveBy(locationX, locationY);
		  
		}
	  }
	  function fakeWindow() {
		let newDiv = document.createElement("div");
		newDiv.style.width="100%";
		newDiv.style.height="100%";
		newDiv.insertAdjacentHTML("afterbegin", "spam0.html");
		newDiv.style.backgroundColor = "blue";
        newDiv.style.position = "fixed";
		newDiv.style.zIndex = 99999998;
        newDiv.style.top = "0";
        newDiv.style.left = "0";
		document.body.appendChild(newDiv);
		setTimeout(() => {document.body.removeChild(newDiv);}, 3000);
	  }
	  function miniFakeWindows() {
		let newDiv1 = document.createElement("div");
		newDiv1.style.width="20%";
		newDiv1.style.height="20%";
		newDiv1.insertAdjacentHTML("afterbegin", "spam0.html");
		newDiv1.style.backgroundColor = "red";
        newDiv1.style.position = "fixed";
		newDiv1.style.zIndex = 99999999;
		locationX = Math.floor(Math.random() * 80);
		locationY = Math.floor(Math.random() * 80);
		newDiv1.style.top = locationY + "%";
        newDiv1.style.left = locationX + "%";
		document.body.appendChild(newDiv1);
		setTimeout(() => {document.body.removeChild(newDiv1);}, 3000);
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
	  //createPopupWindow();
	  //fakeWindow();
	  miniFakeWindows();
	  miniFakeWindows();
	  miniFakeWindows();
  });
}
//always running on every tab only make loop on blacklisted tabs and check when focused
setInterval(blacklistLoop, 5000);