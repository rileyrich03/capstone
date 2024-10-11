function isSiteBlacklisted(callback) {
	chrome.storage.local.get(['blacklist', 'toggleState'], function(data) {
		if (!(data.blacklist && data.toggleState === 'On')) 
			return callback(false);

		const isBlacklisted = data.blacklist.some(function(site) {
			try {
				const blacklistedURL = new URL(site).hostname;
				return window.location.hostname === blacklistedURL;
			} catch (error) {
				return false;
			}
		});
		return callback(isBlacklisted);
	});
}

function getIntensity(callback) {
	
	//get intensity from blacklist
	let site = 'https://' + window.location.hostname + "/";
	let blackmap;
	chrome.storage.local.get('blacklist', function(data) {
		blackmap = new Map(data.blacklist);
		intensity = blackmap.get(site);
		return callback(intensity);

	});
}
function initTwoWrongs() {
	fetch('https://api.example.url.com/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response error');  
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}
function warningCursor() {
	isSiteBlacklisted(function(isBlacklisted) {
		if (isBlacklisted) {

			document.documentElement.style.cursor = 
				`url('${chrome.runtime.getURL("cursor.png")}'), default`;

			let styleElement = document.createElement('style');
			styleElement.innerHTML = `
				* { cursor: ${`url('${chrome.runtime.getURL("cursor.png")}'), default`} !important; }
				a, button { cursor: ${`url('${chrome.runtime.getURL("cursor.png")}'), default`} !important; }
				input, textarea { cursor: ${`url('${chrome.runtime.getURL("cursor.png")}'), default`} !important; }
				`;
			document.head.appendChild(styleElement);
		}
	});
}

function blacklistLoop() {
	isSiteBlacklisted(function(isBlacklisted) {
	getIntensity(function(intensity){
		if (!isBlacklisted || !document.hasFocus()) return;
		
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
	    function miniFakeWindows() {
			let newDiv1 = document.createElement("div");
			newDiv1.style.width="300px";
			newDiv1.style.height = "145px";
			pageNum = Math.floor(Math.random() * 3);
			pageURL = chrome.runtime.getURL("spam" + pageNum +".html");
			newDiv1.innerHTML = '<object type="text/html" data='+ pageURL +' ></object>';
			newDiv1.style.backgroundColor = "none";
      		newDiv1.style.position = "fixed";
			newDiv1.style.outlineStyle = "solid";
			newDiv1.style.outlineWidth = "3px"
			newDiv1.style.outlineColor = "#949494"
			newDiv1.style.zIndex = 99999999;
			locationX = Math.floor(Math.random() * 80);
			locationY = Math.floor(Math.random() * 80);
			newDiv1.style.top = locationY + "%";
			newDiv1.style.left = locationX + "%";
			document.body.appendChild(newDiv1);
			/*
			buttons = document.getElementById("header-buttons");
			buttons.addEventListener('hover', function() {
				locationX = Math.floor(Math.random() * 80);
				locationY = Math.floor(Math.random() * 80);
				newDiv1.style.top = locationY + "%";
				newDiv1.style.left = locationX + "%";
			});
			*/
			setTimeout(() => {document.body.removeChild(newDiv1);}, 6000);
	  	}

		function addSound() {
			let soundURL = chrome.runtime.getURL("thwomp.mp3");
			let audio = new Audio(soundURL);
			let userInteracted = false;

			document.addEventListener('click', function() {
				userInteracted = true;
			});

			document.addEventListener('mouseover', function() {
				if (userInteracted) {
					let audio = new Audio(soundURL);
					audio.play();
				}
			});
		}

		/************************\
		|                        |
		|         DO NOT         |
		|         ROTATE         |
		|         WEBPAGE        |
		|************************|
		|************************|
		\************************/
		/*
		function rotateScreen() { 
			rotation = 0
			const vpCenterX = window.scrollX;
			const vpCenterY = window.scrollY;
			const centerX = (document.documentElement.scrollWidth - window.innerWidth) / 2;
			const centerY = (document.documentElement.scrollHeight);
			window.scrollTo(centerX, 1000);
			function rotate90() {
			  rotation = (rotation % 360) + 90  
			  document.body.style.transformOrigin = "${vpCenterX} ${vpCenterY}";
			  document.body.style.transform = `rotate(${rotation}deg)`;
			}
			rotate90();
			setTimeout(rotate90, 500);
			setTimeout(rotate90, 1000);
			setTimeout(rotate90, 1500);
			window.scrollTo(vpCenterX, vpCenterY);
		}
		*/
		function randomScroll() {
		  scrollY = Math.floor(Math.random() * document.documentElement.scrollHeight);
		  scrollX = Math.floor(Math.random() * document.documentElement.scrollWidth);
		  window.scrollTo(scrollX, scrollY);
		}

		console.log("Intensity of current site: " + intensity);
		addSound();
		for(let i = 0; i < intensity; i += 3)
			miniFakeWindows();
		randomScroll();

	});
	});
}
warningCursor();
setInterval(blacklistLoop, 5000);
