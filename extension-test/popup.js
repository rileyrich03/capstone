document.addEventListener('DOMContentLoaded', function() {
	let userInput = document.getElementById('userInput');
	let button = document.getElementById('button');
	let blacklist = [];
	let blacklistUl = document.getElementById('blacklist');
	let toggle = document.getElementById('toggle');

	chrome.storage.local.get('blacklist', function(data) {
		if (data.blacklist) {
			blacklist = data.blacklist;
		}
		let blackmap = new Map(blacklist);
		blackmap.forEach(function(inten, site, map) {
			if (site != null) {
				console.log(typeof(site));
				makeli(site, inten);
			}
		});
	});

	chrome.storage.local.get(['toggleState'], function(data) {
		if (data.toggleState === undefined) {
			chrome.storage.local.set({ toggleState: 'On' }, function() {
				toggle.innerText = 'On';
			});
		} else if (data.toggleState === 'On') {
			toggle.innerText = 'On';
		} else {
			toggle.innerText = 'Off';
		}
	});

	button.addEventListener('click', function() {
		let site = userInput.value.trim();

		if (!/^https?:\/\//i.test(site)) {
			site = 'https://' + site;
		}

		try {
			new URL(site);
		} catch (error) {
			console.error('Invalid URL:', site);
			return;
		}
		site = new URL(site).hostname;
		site = 'https://' + site + '/';
		if (site) {
			chrome.storage.local.get('blacklist', function(data) {
				let blacklist = data.blacklist || [];
				//Maps cannot be stored in chrome.storage as it can only store JSON
				//To work around this map is converted to array when stored
				let blackmap = new Map(blacklist);
				if (!blackmap.has(site)) {
					blackmap.set(site, 5);
					blacklist = Array.from(blackmap);
					chrome.storage.local.set({ blacklist: blacklist }, function() {
						console.log('Site added to blacklist:', site);

						makeli(site, 5);

						chrome.tabs.query({}, function(tabs) {
							tabs.forEach(function(tab) {
								const blacklistURL = new URL(site).hostname;

								if (blacklistURL === new URL(tab.url).hostname) {
									chrome.tabs.reload(tab.id);
								}
							});
						});

						userInput.value = '';
					});
				} else {
					console.log('Site already in blacklist:', site);
				}
			});
		}
	});

	userInput.addEventListener('keypress', function(event) {
		if (event.key === 'Enter') {
			button.click();
		}
	});

	toggle.addEventListener('click', function() {
		chrome.storage.local.get(['toggleState', 'blacklist'], function(data) {
			let newState = data.toggleState === 'On' ? 'Off' : 'On';
			toggle.textContent = newState;

			chrome.storage.local.set({ toggleState: newState }, function() {
				console.log('Extension is now ' + newState);

				let blacklistData = data.blacklist || [];
				if (blacklistData.length > 0) {
					chrome.tabs.query({}, function(tabs) {
						tabs.forEach(function(tab) {
							blacklistData.forEach(function(site) {
								const blacklistURL = new URL(site).hostname;

								if (blacklistURL === new URL(tab.url).hostname) {
									chrome.tabs.reload(tab.id);
								}
							});
						});
					});
				}
			});
		});
	});
	function makeli(site, inten) {
		//grab blacklist for intensity editing and deleting 
		let blackmap;
		chrome.storage.local.get('blacklist', function(data) {
			blackmap = new Map(data.blacklist);
		});

		let li = document.createElement('li');
		
		let displayURL = site;
		displayURL = displayURL.replace(/^https?:\/\//, ''); 
		displayURL = displayURL.replace(/\//, ''); 
		let separateURL = document.createElement('span');
		separateURL.textContent = displayURL;
		separateURL.className = 'url';

		const itemLeft = document.createElement('div');
		itemLeft.className = 'li-left';
		itemLeft.appendChild(separateURL);

		const itemBottom = document.createElement('div');

		//make slider bar
		const slider = document.createElement('input');
		slider.type = 'range';
   		slider.min = '0';
    	slider.max = '10';
		slider.value = inten;
    	slider.className = 'li-slider';
		
		
		const output = document.createElement('span');

		output.textContent = slider.value;
		
		output.style.paddingLeft = "15px";
		output.style.fontSize = "20px";
		
		slider.addEventListener('input', function() {
        	output.textContent = slider.value;
			blackmap.set(site, slider.value);
			console.log(site + " has been changed to: " + slider.value);
			chrome.storage.local.set({ 'blacklist' : Array.from(blackmap)});
    	});

		itemBottom.appendChild(slider);
		itemBottom.appendChild(output);
		itemLeft.appendChild(itemBottom);
		li.appendChild(itemLeft);

		let deleteButton = document.createElement('button');
		deleteButton.innerText = 'REMOVE';
		deleteButton.className = 'li-button';
		deleteButton.addEventListener('click', function() {
			blackmap.delete(site);
			blacklist = Array.from(blackmap);
			chrome.storage.local.set({ blacklist: blacklist }, function() {
				console.log('Updated blacklist after deletion:', blacklist);
			});
			li.remove();
		});
		li.appendChild(deleteButton);

		blacklistUl.appendChild(li);
	}
});
