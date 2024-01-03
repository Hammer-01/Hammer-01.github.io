chrome.action.onClicked.addListener(async tab => {
    let domain = 'rewards.bing.com';
    
    // if we already have the page open in front of us, don't try to switch
    let urlRegex = new RegExp(`https?://${domain}/`);
    if (urlRegex.test(tab.url)) return;

    // try to find if the tab is already open in the active window and swap to it,
    // otherwise make a new tab
    [tab] = await chrome.tabs.query({url: `*://${domain}/*`, currentWindow: true});
    if (tab) chrome.tabs.update(tab.id, {active: true});
    else chrome.tabs.create({url: `https://${domain}`});


});

chrome.commands.onCommand.addListener(command => {
    if (command === 'random-search') {
        // fetch a random word then open a new tab an search it. The form parameter is
        // required to earn points (value doesn't matter but is normally ANNTA1)
        fetch('https://random-word-api.herokuapp.com/word')
            .then(r => r.json())
            .catch(() => ['fallback']) // use 'fallback' if api is unavailable
            .then(wordArr => {
                chrome.tabs.create({url: 'https://www.bing.com/search?FORM=ANNTA1&q=' + wordArr[0]});
            });
    }
});

chrome.runtime.onStartup.addListener(async () => {
    // check for updates when browser restarts if not disabled
    let {noUpdate} = await chrome.storage.local.get('noUpdate');
    if (noUpdate) return;

    // fetch manifest from github
    const manifestUrl = 'https://raw.githubusercontent.com/Hammer-01/hammer-01.github.io/main/extensions/microsoft-rewards-helper/manifest.json';
    let newVersion = await fetch(manifestUrl)
        .then(r => r.json())
        .then(manifest => manifest.version);
    chrome.storage.local.set({newVersion});
});