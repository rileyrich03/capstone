function isSiteBlacklisted(callback) {
    chrome.storage.local.get(['blacklist', 'toggleState'], function (data) {
        if (!(data.blacklist && data.toggleState === 'On'))
            return callback(false);

        const isBlacklisted = data.blacklist.some(function (site) {
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
    let site = 'https://' + window.location.hostname + "/";
    chrome.storage.local.get('blacklist', function (data) {
        let blackmap = new Map(data.blacklist);
        let intensity = blackmap.get(site);
        return callback(intensity);
    });
}

function warningCursor() {
    isSiteBlacklisted(function (isBlacklisted) {
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

function randomZoom() {
    let zoomXY = Math.random() * (1.50 - 0.30) + 0.30;
    document.body.style.zoom = zoomXY;
    document.body.style.transform = `scale(${zoomXY})`;
    document.body.style.transformOrigin = 'center center';

    setTimeout(() => {
        document.body.style.zoom = 1;
        document.body.style.transform = `scale(1)`;
    }, 4500);
}

function randomScroll() {
	getIntensity(function(intensity) {
		if (intensity = 0)
			return;
		const currX = window.screenX;
		const currY = window.screenY;
		const maxScrollH = (document.documentElement.scrollHeight) / (11 - intensity);
		const maxScrollW = (document.documentElement.scrollWidth) / (11 - intensity);
    	let scrollY = currX + Math.floor(Math.random() * 2 * (maxScrollH));
    	let scrollX = currY + Math.floor(Math.random() * 2 * (maxScrollW)); 
		console.log("scrolling to " + (scrollX-currX) + ", " + (scrollY-currY))
    	window.scrollTo(scrollX, scrollY);
	});
}

function bfd() {
	isSiteBlacklisted(function(isBlacklisted) {
		if (!isBlacklisted)
			return;
		const bfd = document.createElement('div');
    
    	// Apply styles to cover the whole screen
    	bfd.style.position = 'fixed';
    	bfd.style.top = '0';
    	bfd.style.left = '0';
    	bfd.style.width = '100vw';
    	bfd.style.height = '100vh';
    	bfd.style.backgroundColor = 'red';
    	bfd.style.zIndex = '99999999';
		
		const removeButton = document.createElement('button');
		removeButton.style.height = '50vh';
		removeButton.style.width = '50vw';
		removeButton.style.top = '25%';
		removeButton.style.left = '25%';
		removeButton.innerText = "Enter Distracting Website.";
		removeButton.style.position = 'absolute';
		removeButton.style.cursor = 'pointer';

		removeButton.addEventListener('click', function() {
			document.body.removeChild(bfd);
			setInterval(blacklistLoop, 5000);
		});
		bfd.appendChild(removeButton);
    	
    	document.body.appendChild(bfd);
	});
}
function blacklistLoop() {
    isSiteBlacklisted(function (isBlacklisted) {
        getIntensity(function (intensity) {
            if (!isBlacklisted || !document.hasFocus()) return;

            function miniFakeWindows() {
                let newDiv1 = document.createElement("div");
                newDiv1.style.width = "300px";
                newDiv1.style.height = "145px";
                let pageNum = Math.floor(Math.random() * 3);
                let pageURL = chrome.runtime.getURL(`spam${pageNum}.html`);
                newDiv1.innerHTML = `<object type="text/html" data='${pageURL}'></object>`;
                newDiv1.style.position = "fixed";
                newDiv1.style.outline = "solid 3px #949494";
                newDiv1.style.zIndex = 99999998;
                newDiv1.style.top = `${Math.floor(Math.random() * 80)}%`;
                newDiv1.style.left = `${Math.floor(Math.random() * 80)}%`;
                document.body.appendChild(newDiv1);
                setTimeout(() => { document.body.removeChild(newDiv1); }, 6000);
            }

            function addSound() {
                let soundURL = chrome.runtime.getURL("thwomp.mp3");
                let audio = new Audio(soundURL);

				function soundChance() {
					randomNumb = (Math.random() * 10)
					if (randomNumb <= ((intensity) ** 3)/100) {
                       	audio.play();
					}
				}
				//remove event listeners for refresh
				document.removeEventListener('mouseover', soundChance);
				document.addEventListener('mouseover', soundChance);

                document.addEventListener('click', function () {
                    audio.play();
                });
            }

            console.log("Intensity of current site: " + intensity);
            addSound();

            for (let i = 0; i < intensity; i += 3) {
                miniFakeWindows();
            }

            if (Math.random() > 0.5) {
                setTimeout(randomZoom, 0); 
                setTimeout(randomScroll, 1000);
            } else {
                setTimeout(randomScroll, 0);
                setTimeout(randomZoom, 1000);
            }
        });
    });
}

warningCursor();
bfd();
//moved blacklist loop timeout to bfd button click