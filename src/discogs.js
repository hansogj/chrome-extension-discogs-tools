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

["addToCollection.js", "filterSellers.js", "addWantList.js"].forEach(applyToWindow);


var  style = "style=\"position:absolute; top:57px; right:0\" ";

function addToCollectionBtns(header) {
  header.innerHTML =
    '<li>' +
    '<button class="button button_small button_blue"' + style +' onclick="javascript:discogs.addToCollection(this, \'LP HoG\')">LP HoG</button> <br />' +
    // '<button class="button button_small button_blue"          style="float:right"            onclick="javascript:addToCollection(this, \'CD HoG\')">CD HoG</button> <br />' +
    // '<button class="button button button_green button_small"  style="float:right; margin:0;" onclick="javascript:addToCollection(this, \'CD Ingvill\')">CD Ingvill</button>' +
    '</li>'  + header.innerHTML;
}


function addWantlistBtnToModalBox(boxHeader) {

  if (boxHeader && !document.getElementById("wantlistbtn")) {
    boxHeader.innerHTML = '<button id="wantlistbtn" class="button button_small button_blue"  onclick="javascript:discogs.addWantList(this, \'PUT\')">Add all to wantlist</button> <br />' +
      '<button id="wantlistbtn" class="button button_small button_green" onclick="javascript:discogs.addWantList(this, \'DELETE\')">Delte from  wantlist</button> <br />' +
      boxHeader.innerHTML;
  }
}


find(document, "strong.pagination_total").forEach(function (paginationTotal) {
  document.title = document.querySelector("strong.pagination_total").textContent.match(/of\s([\d|\,]*)/)[1]
});

find(document, ".add_to_collection").forEach(function(elem) {
  find(document, "#site_header #activity_menu").forEach(addToCollectionBtns);
});

setTimeout(function () {
  setInterval(function () {
    find(document, ".react-modal-header" )
      .forEach(addWantlistBtnToModalBox);
  }, 500);
}, 2000);
