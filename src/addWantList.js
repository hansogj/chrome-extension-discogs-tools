var find = require("find-js"),
    xhrJson =  require("json-xhr-promise").default;

function addItemToWantList(item) {
  return xhrJson("PUT", "https://www.discogs.com/_rest/wantlist/" + item.id, item)
    .then(function (response) {
      console.log(response);
    }).catch(function (e) {
      console.error(e);
    });
}


function getMasterId(cb) {
  var master = window.location.pathname.split("master/");
  if(master.length !== 2) {
    throw new Error("Missing master release id");
  };
  return cb(master.pop());
}

function addWantList() {

  find(document, ".react-modal-content .card.react-card" )
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
    }).map(addItemToWantList);
}

module.exports = addWantList;
