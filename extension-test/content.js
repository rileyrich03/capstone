/**
 * @file content.js
 * @description Applies the main logic for each one of the distraction 
 * injections that occur on blacklisted sites. It controls the timing 
 * and amount of distraction injections that appear at once depending on
 * intensity level, checks if the current site is blacklisted, then 
 * initiates the injections. The injections so far include visual and 
 * audio popups, automatically pausing videos, cursor changes, randomized 
 * scrolling and zooming, and a forced warning cover screen (bfd).
 * @author Joseph Curtin and Riley Richardson
 * @date 12/11/2024 (Last modified)
 */
let loopInterval;
let pauseInterval;
let soundDistractions = false;
let distractionTimeouts = [];


function isSiteBlacklisted(callback) {
    chrome.storage.local.get(['blacklist', 'toggleState'], function (data) {
        if (!(data.blacklist && data.toggleState === 'On'))
            return callback(false);

        let blackmap = new Map(data.blacklist);
        let site = 'https://' + window.location.hostname + '/';
        let isBlacklisted = blackmap.has(site);
        callback(isBlacklisted);
    });
}

function getIntensity(callback) {
    let site = 'https://' + window.location.hostname + '/';
    chrome.storage.local.get('blacklist', function (data) {
        let blackmap = new Map(data.blacklist);
        let intensity = blackmap.get(site);
        if (intensity === undefined || intensity === null) {
            intensity = 0;
        }
        callback(intensity);
    });
}

let intenNotZero = false;
getIntensity(function (intensity) {
	intenNotZero = intensity != 0;
});

chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName === 'local' && changes.blacklist) {
		getIntensity(function (intensity) {
			if(intenWasZero && intensity != 0) {
				startDistractions();
			}
			if(intensity == 0)
				intenWasZero = True;
			else
				intenWasZero = False;
		})
    }
});

function startDistractions() {
    isSiteBlacklisted(function (isBlacklisted) {
		getIntensity(function (intensity) {
        	if (!isBlacklisted || intensity == 0) {
				intensityOnZero();
				return;
			}
        	else {
				warningCursor();
				bfd();
				pauseVideo();
        	}
		});
    });
}

function intensityOnZero() {
    document.body.style.zoom = '100%';
    document.body.style.transform = 'scale(1)';
    document.body.style.transformOrigin = 'center center';

    document.documentElement.style.cursor = 'default';
    document.querySelectorAll('style[data-warning-cursor]').forEach(ellement => ellement.remove());

    if (loopInterval) {
        clearInterval(loopInterval);
        loopInterval = null;
    }

    if (pauseInterval) {
        clearInterval(pauseInterval);
        pauseInterval = null;
    }

    let fakeWindows = document.querySelectorAll('.miniFakeWindow');
    fakeWindows.forEach(ellement => ellement.remove());

    if (document.getElementById('bfd')) {
        document.getElementById('bfd').remove();
    }

    distractionTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    distractionTimeouts = [];

    if (soundDistractions) {
        document.removeEventListener('mouseover', soundChance);
        document.removeEventListener('click', soundClick);
        soundDistractions = false;
    }
}

function warningCursor() {
    getIntensity(function (intensity) {
        if (intensity == 0) return;

        document.documentElement.style.cursor = `url('${chrome.runtime.getURL("cursor.png")}'), default`;

        if (!document.querySelector('style[data-warning-cursor]')) {
            let styleElement = document.createElement('style');
            styleElement.setAttribute('data-warning-cursor', 'true');
            styleElement.innerHTML = `
                * { cursor: ${`url('${chrome.runtime.getURL("cursor.png")}'), default`} !important; }
                a, button { cursor: ${`url('${chrome.runtime.getURL("cursor.png")}'), default`} !important; }
                input, textarea { cursor: ${`url('${chrome.runtime.getURL("cursor.png")}'), default`} !important; }
            `;
            document.head.appendChild(styleElement);
        }
    });
}

function bfd() {
    getIntensity(function (intensity) {
        if (intensity == 0) return;

        chrome.storage.local.get('bfdShownSites', function(data) {
            let bfdShownSites = data.bfdShownSites || [];
            let site = 'https://' + window.location.hostname + '/';

            if (bfdShownSites.includes(site)) {
                //return;
            }

            if (!document.getElementById('bfd')) {
                const bfd = document.createElement('div');
                bfd.id = 'bfd';

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
                    bfd.remove();
                    blacklistLoop();
                    if (!loopInterval) {
                        loopInterval = setInterval(blacklistLoop, 11000 - (1000 * intensity));
                    }

                    bfdShownSites.push(site);
                    chrome.storage.local.set({bfdShownSites: bfdShownSites});
                });
                bfd.appendChild(removeButton);

                document.body.appendChild(bfd);
            }
        });
    });
}

function blacklistLoop() {
    getIntensity(function (intensity) {
        if (intensity == 0) return;

        isSiteBlacklisted(function (isBlacklisted) {
            if (!isBlacklisted || !document.hasFocus()) return;

            function miniFakeWindows() {
                let newDiv1 = document.createElement("div");
                newDiv1.classList.add('miniFakeWindow');
                newDiv1.style.width = "300px";
                newDiv1.style.height = "145px";
            
                let pageNum = Math.floor(Math.random() * 7);
                let pageURL = chrome.runtime.getURL(`spam${pageNum}.html`);
                
                console.log("PageNum: " + pageNum);
                console.log("Page: " + pageURL);
                newDiv1.innerHTML = `<object type="text/html" data='${pageURL}'></object>`;
            
                newDiv1.style.position = "fixed";
                newDiv1.style.outline = "solid 3px #949494";
                newDiv1.style.zIndex = 99999998;
                newDiv1.style.top = `${Math.floor(Math.random() * 80)}%`;
                newDiv1.style.left = `${Math.floor(Math.random() * 80)}%`; 
                document.body.appendChild(newDiv1);
                let timeoutId = setTimeout(() => { 
                    if (document.body.contains(newDiv1)) {
                        document.body.removeChild(newDiv1); 
                    }
                }, 6000);
            
                distractionTimeouts.push(timeoutId);
            }
            
            function addSound() {
                let soundURL = chrome.runtime.getURL("thwomp.mp3");
                let audio = new Audio(soundURL);

                function soundChance() {
                    getIntensity(function(intensity) {
                        if (intensity == 0) return;
                        let randomNumb = (Math.random() * 10);
                        if (randomNumb <= ((intensity) ** 3)/100) {
                            audio.play();
                        }
                    });
                }

                function soundClick() {
                    getIntensity(function(intensity) {
                        if (intensity == 0) return;
                        audio.play();
                    });
                }

                if (!soundDistractions) {
                    document.addEventListener('mouseover', soundChance);
                    document.addEventListener('click', soundClick);
                    soundDistractions = true;
                }
            }

            console.log("Intensity of current site: " + intensity);
            addSound();

            for (let i = 0; i < intensity; i += 3) {
                miniFakeWindows();
            }
			//25% chance for scroll, 25%, and for zoom 50% nothing
			chance = Math.random()
            if (chance <= 0.25) {
                setTimeout(randomZoom, 0); 
                //setTimeout(randomScroll, 1000);
            } 
			else if(chance >= 0.75) {
                setTimeout(randomScroll, 0);
                //setTimeout(randomZoom, 1000);
            }
        });
    });
}

function randomScroll() {
    getIntensity(function (intensity) {
        if (intensity == 0) return;

        const currentX = window.scrollX;
        const currentY = window.scrollY;
        const maxScrollH = (document.documentElement.scrollHeight) / (11 - intensity);
        const maxScrollW = (document.documentElement.scrollWidth) / (11 - intensity);
        let scrollY = currentY + Math.floor(Math.random() * 2 * (maxScrollH));
        let scrollX = currentX + Math.floor(Math.random() * 2 * (maxScrollW)); 
        console.log("scrolling to " + (scrollX-currentX) + ", " + (scrollY-currentY));
        window.scrollTo(scrollX, scrollY);
    });
}

function randomZoom() {
    getIntensity(function(intensity) {
        if (intensity == 0) return;

        let zoomXY = Math.random() * (1.50 - 0.30) + 0.30;
        document.body.style.zoom = zoomXY;
        document.body.style.transform = `scale(${zoomXY})`;
        document.body.style.transformOrigin = 'center center';

        let timeoutId = setTimeout(() => {
            document.body.style.zoom = 1;
            document.body.style.transform = `scale(1)`;
        }, 4500);
        distractionTimeouts.push(timeoutId);
    });
}

function pauseVideo() {
    getIntensity(function(intensity) {
        if (intensity == 0) return;

        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            video.pause();
        });

        if (!pauseInterval) {
            pauseInterval = setInterval(() => {
                getIntensity(function(intensity) {
                    if (intensity == 0) {
                        clearInterval(pauseInterval);
                        pauseInterval = null;
                        return;
                    }
                    videos.forEach(video => {
                        video.pause();
                    });
                });
            }, 11000);
        }
    });
}

startDistractions();
