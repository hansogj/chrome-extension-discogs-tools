
var find = require("find-js"),
    focus = require("./focus"),
    xhrJson =  require("json-xhr-promise").default,
    XMLHttpRequestPromise = require('xhr-promise');

var xhr = new XMLHttpRequestPromise();

function clickElem(e) {
  e.click();
  return e;
}


function serialize(obj) {
  return Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
}

function addNotes(notes) {
  find(document, ".notes_field[data-field='3'] .notes_show").forEach(clickElem);
  find(document, ".notes_textarea").forEach(function (ta) {
    setTimeout(function () {
      ta.value = notes;
      find(ta.parentNode, "a.button_green").forEach(clickElem);
      focus("#search_q");
    }, 1000);
  });
}

function update(data) {
  return xhr.send({
    method: 'POST',
    url: "https://www.discogs.com/list/coll_update",
    data: serialize(data)
  })

}


function addToFolder(release_id) {
  if (release_id !== undefined) {
    return xhrJson("POST", "https://www.discogs.com/_rest/collection", {release_id: parseInt(release_id)})
      .then(addFolderAndCondition.bind(this, parseInt(release_id)));
  } else {
    alert("Release_id: ", release_id);
  }
}


function log(e) {
  return console.log(e), e;
}

function error(e) {
  return console.error(e), e;
}

function addFolderAndCondition(release_id, release) {
  var counter = 0;
  function count(e) {
    counter++;
    return e;
  }

  var coll_id = parseInt(release.id);
  update({
    coll_id:coll_id,
    field_id: undefined,
    folder_id:653066,
    val:"LP HoG",
    notes:653066
  })
    .then(log, error)
    .then(count);

  update({
    release_id: release_id,
    coll_id:coll_id,
    field_id: "1",
    folder_id:null,
    val:"Very Good Plus (VG+)",
    notes:"Very Good Plus (VG+)"
  })
    .then(log, error)
    .then(count);

  update({
    release_id: release_id,
    coll_id:coll_id,
    field_id:"2",
    folder_id:null,
    val:"Very Good Plus (VG+)",
    notes:"Very Good Plus (VG+)"
  })
    .then(log, error)
    .then(count);

  setInterval(function () {
    if (counter > 2) {
      window.location.reload();
    }

  }, 500);
}


function getReleasseId() {
  return window.location.pathname.split("/release/").pop()
}


function addToCollection (e, notes) {
  //find(document, ".add_to_collection").forEach(clickElem)
  if(notes) {
    //  addNotes(notes); //
    addToFolder(getReleasseId());
  }


}



function listCollection(filter) {
  return find(document.querySelector(".release_list_table"), "tr").filter(filter)  ;
}

function listFormatCollection(format) {
  return listCollection(function(row) {
    return find(row, "[data-header=Format]").filter(function(format_show){
      return format_show.innerText.match(format)}).length
  });
}

function listNotedCollection(notes) {
  return listCollection(function(row) {
    return find(row, ".notes_show").filter(function(notes_show){
      return notes_show.innerText.match(notes)}).length
  });
}

function check(row) {
  return find(row, "input[type=checkbox]")
    .map(function (input) {return input.click(),input});
}

focus("#search_q");
module.exports = addToCollection
