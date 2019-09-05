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



function addBtn(folder) {
  return `<a class="button button-small button-green" onclick="javascript:window.discogs.addToCollection(this, '${folder}')">
            <i class="icon icon-collection"></i> 
            ${folder}
          </a>`
}

function addToCollectionBtns(btnlist) {
  btnlist.innerHTML = btnlist.innerHTML + 
    '<div class="collections_buttons hide_mobile">' +  
    addBtn('LP HoG') +  addBtn('CD HoG') +
    '</div>'
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




find(document, ".section.collections ")
  .filter(function(_, i){return i === 0})
  .forEach(addToCollectionBtns);

setTimeout(function () {
  setInterval(function () {
    find(document, ".react-modal-header" )
      .forEach(addWantlistBtnToModalBox);
  }, 500);
}, 2000);
