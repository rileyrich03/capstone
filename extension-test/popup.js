document.addEventListener('DOMContentLoaded', function() {
let userInput = document.getElementById('userInput');
let button = document.getElementById('button');

let blacklist = [];
let blacklistUl = document.getElementById('blacklist');

chrome.storage.local.get('blacklist', function(data) {
  if (data.blacklist) {
    blacklist = data.blacklist;
  }

  blacklist.forEach(function(site) {
    let li = document.createElement('li');

    li.textContent = site;
    blacklistUl.appendChild(li);
  });
});

button.addEventListener('click', function() {
  let site = userInput.value.trim();
  
  if (site) {
    chrome.storage.local.get('blacklist', function(data) {
      let blacklist = data.blacklist || [];
      
      if (!blacklist.includes(site)) {
        blacklist.push(site);
        chrome.storage.local.set({ blacklist: blacklist }, function() {
       
        let li = document.createElement('li');
        li.textContent = site;
        blacklistUl.appendChild(li);

        userInput.value = '';
       });
      }
    });
   }

  });
  
});
