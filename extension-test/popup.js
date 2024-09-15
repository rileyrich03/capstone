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
  
	  blacklist.forEach(function(site) {
		if (site != null) {
		  let li = document.createElement('li');
		  li.textContent = site;
		  blacklistUl.appendChild(li);
  
		  let deleteButton = document.createElement("button");
		  deleteButton.innerText = "delete";
		  deleteButton.addEventListener("click", function() {
			blacklist = blacklist.filter(s => s !== site);
			chrome.storage.local.set({ blacklist: blacklist }, function() {
			  console.log('Updated blacklist after deletion:', blacklist);
			});
			li.remove();
		  });
		  li.appendChild(deleteButton);
		}
	  });
	});
  
	chrome.storage.local.get(["toggleState"], function(data) {
	  if (data.toggleState === 'On') {
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
  
	  if (site) {
		chrome.storage.local.get('blacklist', function(data) {
		  let blacklist = data.blacklist || [];
  
		  if (!blacklist.includes(site)) {
			blacklist.push(site);
			chrome.storage.local.set({ blacklist: blacklist }, function() {
			  console.log('Site added to blacklist:', site);
			  let li = document.createElement('li');
			  li.textContent = site;
			  blacklistUl.appendChild(li);
  
			  let deleteButton = document.createElement("button");
			  deleteButton.innerText = "delete";
			  deleteButton.addEventListener("click", function() {
				blacklist = blacklist.filter(s => s !== site);
				chrome.storage.local.set({ blacklist: blacklist }, function() {
				  console.log('Updated blacklist after deletion:', blacklist);
				});
				li.remove();
			  });
			  li.appendChild(deleteButton);
  
			  userInput.value = '';
			});
		  } else {
			console.log('Site already in blacklist:', site);
		  }
		});
	  }
	});
  
	userInput.addEventListener('keypress', function(event) {
	  if (event.key === "Enter") {
		button.click();
	  }
	});
  
	toggle.addEventListener('click', function() {
	  chrome.storage.local.get(['toggleState'], function(data) {
		let newState = data.toggleState === 'On' ? 'Off' : 'On';
		toggle.textContent = newState;
  
		chrome.storage.local.set({ toggleState: newState }, function() {
		  console.log('Extension is now ' + newState);
		});
	  });
	});
  });
 
