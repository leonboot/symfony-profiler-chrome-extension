var profilerUrl = [];

var currentTab;

chrome.tabs.onActivated.addListener(function (tab) {
    currentTab = tab.tabId;
    updateIcon();
});

chrome.browserAction.onClicked.addListener(function() {
    if (profilerUrl.hasOwnProperty(currentTab) && profilerUrl[currentTab] !== null) {
        chrome.tabs.create({url: profilerUrl[currentTab]});
    }
});

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        if (details.type === 'main_frame') {
            profilerUrl[currentTab] = null;
            for (var header of details.responseHeaders) {
                if (header.name.toLowerCase() === 'x-debug-token-link') {
                    profilerUrl[currentTab] = header.value;
                }
            }
            updateIcon();
        }
    },
    {urls: ["<all_urls>"]},
    ['responseHeaders']
);

updateIcon = function() {
    if (profilerUrl.hasOwnProperty(currentTab) && profilerUrl[currentTab] !== null) {
        chrome.browserAction.setIcon({path: 'icon-38.png'});
    } else {
        chrome.browserAction.setIcon({path: 'icon-disabled-38.png'});
    }
};