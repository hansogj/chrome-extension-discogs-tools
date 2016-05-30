var find = require("find-js"),
    xhrJson =  require("json-xhr-promise").default,
    XMLHttpRequestPromise = require('xhr-promise'),
    xhr = new XMLHttpRequestPromise();


function buildUrl(itemId) {
  return "https://www.discogs.com/_rest/wantlist/" + itemId;
}

function removeItemFromList(item) {
  return xhr.send({
    method: 'DELETE',
    url: buildUrl(item.id),
    data: item
  })
}


function addItemToWantList(item) {
  return xhrJson("PUT",  buildUrl(item.id), item)

}


function getMasterId(cb) {
  var master = window.location.pathname.split("master/");
  if(master.length !== 2) {
    throw new Error("Missing master release id");
  };
  return cb(master.pop());
}


function getListOfItems() {
  return find(document, ".react-modal-content .card.react-card" )
    .map(function (card) {
      return find(card, "a.search_result_title")
        .map(function (a) {return a.href;})
        .shift();
    })
    .map(function(url) {return url.split("release/").pop();})
    .map(function (releaseId) {
      return getMasterId(function (masterId) {
        return {id: releaseId, master_id: masterId};
      });
    });
}

function addWantList(self, method) {
   getListOfItems()
    .map(method === "PUT" ? addItemToWantList  : removeItemFromList)
    .then(function (response) {return console.log(response), response;})
    .catch(function (e) {return console.error(e), e;});
}

module.exports = addWantList;
