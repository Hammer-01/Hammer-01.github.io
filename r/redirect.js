(async function() { // allow use of await
let search = window.location.search.slice(1);
let protocol = search.match(/^(\w+:|\/\/)/g);
let customRedirect = protocol == "_:";
let dispUrl = customRedirect ? decodeURIComponent(search.slice(2)) : search;
let url = customRedirect ? (await fetch('redirects.json').then(r => r.json()))[dispUrl] : (protocol ? "" : "//") + dispUrl;
let pageContent = document.referrer ? `<p>A link from the page: <a href="${document.referrer}">${document.referrer}</a> ` : "";
if (!url || !search) {
    pageContent += document.referrer ? "has sent you to a dead link.</p>" : "<p>Error: Invalid link.</p>";
    if (document.referrer) pageContent += `<p>You can <a href="javascript:window.history.back()">return to the previous page</a>.</p>`;
    document.body.innerHTML = pageContent;
} else if (url.slice(0, 11) === "javascript:") {
    document.title = customRedirect ? dispUrl : "Bookmarklet";
    if (customRedirect) url = url.replaceAll('%', '%25').replaceAll('"', '%22');
    pageContent += document.referrer ? "has directed you to this bookmarklet:</p>" : "<p>Below is a bookmarklet - a piece of javascript code that runs when you click it.</p>";
    if (!customRedirect) pageContent += "<p><strong>Warning: make sure you trust the source of this bookmarklet before running it.</strong></p>";
    pageContent += `<p>Drag <a href="${url}">${customRedirect?dispUrl:"this link"}</a> to your bookmark bar to save it.</p>`;
    if (customRedirect) {
        pageContent += "<p>Or you can drag this link instead to always have the latest version:</p>";
        pageContent += `<p><a href="javascript:(function(){fetch('https://hammer-01.github.io/r/redirects.js').then(response=>{if (response.ok){return response.text()} ${url}; return '123456789012{%22${dispUrl}%22:%22%22}'}).then(text=>eval(eval('('+text.slice(12)+')')['${dispUrl}']))})()">${dispUrl}</a></p>`;
    }
    pageContent += "<p><br>The code for the bookmarklet is:</p>";
    pageContent += `<textarea id="bookmarklet-code" cols="60" rows="20" spellcheck="false">${decodeURIComponent(url)}</textarea>`
    document.body.innerHTML = pageContent;
} else {
    if (document.referrer) pageContent += "wants to redirect you.</p>";
    pageContent += `<p>Click to redirect to <a href="${url}">${dispUrl}</a>.</p>`;
    if (document.referrer) pageContent += `<p>If you do not want to visit that page, you can <a href="javascript:window.history.back()">return to the previous page</a>.</p>`;
    pageContent += `<p>You will be automatically redirected in <span id="countdown">5</span> second<span id="sec">s</span>.</p>`
    document.body.innerHTML = pageContent;
    setInterval((num) => {
        num.textContent = num.textContent - 1;
        if (num.textContent === '1') document.getElementById('sec').textContent = '';
        if (num.textContent === '0') {
            document.getElementById('sec').textContent = 's';
            window.location.href = url;
        }
    }, 1000, document.getElementById('countdown'));
}
})();
