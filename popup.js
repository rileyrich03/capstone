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
    if(site != null)
		addWebsite(site);
  });
});

//init toggle button
chrome.storage.local.get(["toggleState"], function(data) {
	if (data.toggleState === 'On') {
		toggle.innerText = 'On';
	} else {
		toggle.innerText = 'Off';
	}
});

button.addEventListener('click', function() {
  let site = userInput.value.trim();
  
  if (site) {
    chrome.storage.local.get('blacklist', function(data) {
      let blacklist = data.blacklist || [];
      
      if (!blacklist.includes(site)) {
        blacklist.push(site);
        chrome.storage.local.set({ blacklist: blacklist }, function() {
       
        addWebsite(site);

        userInput.value = '';
       });
      }
    });
   }

  });
  //Toggle button for extension
  toggle.addEventListener('click', function() {
	chrome.storage.local.get(['toggleState'], function(data) {
		let newState = data.toggleState === 'On' ? 'Off' : 'On';
		toggle.textContent = newState;

		chrome.storage.local.set({ toggleState: newState}, function() {
			console.log('Extension is now ' + newState);
		})
	});
  });
  //function used when adding websites to the blacklist
  function addWebsite (site) {
	let li = document.createElement('li');

    li.textContent = site;
	
	blacklistUl.appendChild(li);

	let deleteButton = document.createElement("button");
	deleteButton.innerText = "delete";
	deleteButton.addEventListener("click", function() {
		delete blacklist[blacklist.indexOf(site)];
		chrome.storage.local.set({blacklist: blacklist}, function(){});
		li.remove();
	})
	li.appendChild(deleteButton);
  }
});

