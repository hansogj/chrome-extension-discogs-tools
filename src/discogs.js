var find = require("find-js");
window.disocgs = window.disocgs || {};
function applyToWindow(scriptName) {

  var s = document.createElement('script');
  // TODO: add "script.js" to web_accessible_resources in manifest.json
  s.src = chrome.extension.getURL(scriptName);
  s.onload = function() {
    this.parentNode.removeChild(this);
  };

  (document.head||document.documentElement).appendChild(s);

}

[
    "addToCollection.js", 
    "filterSellers.js", 
    "addWantList.js", 
    "filterRelease.js",
    "unwantedLabels.js",

].forEach(applyToWindow);


var  style = "style=\"position:absolute; top:0px; right:150px\" ";

function addToCollectionBtns(header) {
  header.innerHTML =
    '<li>' +
    '<button class="button button_small button_blue"' + style +' onclick="javascript:window.discogs.addToCollection(this, \'LP HoG\')">LP HoG</button> <br />' +
    '</li>'  + header.innerHTML;
}


function addWantlistBtnToModalBox(boxHeader) {

  if (boxHeader && !document.getElementById("wantlistbtn")) {
    boxHeader.innerHTML = '<button id="wantlistbtn" class="button button_small button_blue"  onclick="javascript:window.discogs.addWantList(this, \'PUT\')">Add all to wantlist</button> <br />' +
      '<button id="wantlistbtn" class="button button_small button_green" onclick="javascript:discogs.addWantList(this, \'DELETE\')">Delte from  wantlist</button> <br />' +
      boxHeader.innerHTML;
  }
}

// run

find(document, "strong.pagination_total").forEach(function (paginationTotal) {
  document.title = document.querySelector("strong.pagination_total").textContent.match(/of\s([\d|\,]*)/)[1]
});

find(document, "#site_header #activity_menu")
  .filter(function(_, i){return i === 0})
  .forEach(addToCollectionBtns);

setTimeout(function () {
  setInterval(function () {
    find(document, ".react-modal-header" )
      .forEach(addWantlistBtnToModalBox);
  }, 500);
}, 2000);
