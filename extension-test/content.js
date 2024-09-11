chrome.storage.local.get(['blacklist', 'toggleState'], function(data) {
    if (data.blacklist && data.toggleState === 'On')
        {
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
        });
    }
});
