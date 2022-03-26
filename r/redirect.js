let search = window.location.search.slice(1);
let protocol = search.match(/^(\w+:|\/\/)/g);
let customRedirect = protocol == "_:";
let dispUrl = customRedirect ? search.slice(2) : search;
let url = customRedirect ? redirects[dispUrl] : (protocol ? "" : "//") + dispUrl;
let pageContent = document.referrer ? `A link from the page: <a href="${document.referrer}">${document.referrer}</a> ` : "";
if (url.slice(0, 11) === "javascript:") {
    document.title = customRedirect ? dispUrl : "Bookmarklet";
    if (customRedirect) url = url.replaceAll('%', '%25').replaceAll('"', '%22');
    pageContent += document.referrer ? "has directed you to this bookmarklet: <br>" : "Below is a bookmarklet - a piece of javascript code that runs when you click it.<br>";
    pageContent += `Drag <a href="${url}">${customRedirect?dispUrl:"this link"}</a> to your bookmark bar to save it.<br>`;
    if (customRedirect) {
        pageContent += "Or you can drag this link instead to always have the latest version: ";
        pageContent += `<a href="javascript:(function(){fetch('https://hammer-01.github.io/r/redirects.js').then(response=>{if (response.ok){return response.text()} ${url}; return '123456789012{%22${dispUrl}%22:%22%22}'}).then(text=>eval(eval('('+text.slice(12)+')')['${dispUrl}']))})()">${dispUrl}</a><br>`;
    }
    pageContent += "<br>The code for the bookmarklet is: <br>";
    pageContent += `<textarea id="bookmarklet-code" cols="60" rows="20"></textarea>`
    document.body.innerHTML = pageContent;
    document.getElementById('bookmarklet-code').textContent = decodeURIComponent(url);
} else {
    if (document.referrer) pageContent += "wants to redirect you.<br>";
    pageContent += `Click to redirect to <a href="${url}">${dispUrl}</a>.<br>`;
    if (document.referrer) pageContent += `If you do not want to visit that page, you can <a href="javascript:window.history.back()">return to the previous page</a>.<br>`;
    pageContent += `You will be automatically redirected in <span id="countdown">5</span> second<span id="sec">s</span>.`
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
