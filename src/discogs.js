var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('addToCollection.js');
s.onload = function() {
  this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

console.log(addToCollection);
var paginationTotal = document.querySelector("strong.pagination_total"),
    header = document.querySelector("#site_header #activity_menu"),
    addToCollection = document.querySelector(".add_to_collection");


if (paginationTotal) {
  document.title = document.querySelector("strong.pagination_total").textContent.match(/of\s([\d|\,]*)/)[1]
  setTimeout(function() {
    window.location.reload();
  }, 5*60*1000)
}

if(addToCollection) {
  header.innerHTML =
    '<li>' +
    '<button class="button button_small button_blue"          style="float:right"            onclick="javascript:addToCollection(this, \'LP HoG\')">LP HoG</button> <br />' +
    '<button class="button button_small button_blue"          style="float:right"            onclick="javascript:addToCollection(this, \'CD HoG\')">CD HoG</button> <br />' +
    '<button class="button button button_green button_small"  style="float:right; margin:0;" onclick="javascript:addToCollection(this, \'CD Ingvill\')">CD Ingvill</button>' +
    '</li>'  + header.innerHTML;
}
