import redirects from "./redirects.json";
console.log(`Referrer: ${window.location.referrer}`);
console.log(`Redirect url: ${window.location.search}`);
let protocol = window.location.search.match(/^[^.\/]+:/) ? "" : "http://";
let pageContent = document.referrer ? `A link from the page: <a href="${document.referrer}">${document.referrer}</a> wants to redirect you.<br>` : "";
pageContent += `Click to redirect to <a href="${protocol+window.location.search.slice(1)}">${protocol+window.location.search.slice(1)}</a>.<br>`;
if (document.referrer) pageContent += `If you do not want to visit that page, you can <a href="javascript:window.history.back()">return to the previous page</a>.`;
document.body.innerHTML = pageContent;
