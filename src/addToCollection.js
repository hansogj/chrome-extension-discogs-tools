
var find = require("find-js"),
    focus = require("./focus");


function clickElem(e) {
  e.click();
}


function addToCollection (e, notes) {
  find(document, ".add_to_collection").forEach(clickElem)
  if(notes) {
    find(document, ".notes_field[data-field='3'] .notes_show").forEach(clickElem);
    find(document, ".notes_textarea").forEach(function (ta) {
      setTimeout(function () {
        ta.value = notes;
        find(ta.parentNode, "a.button_green").forEach(clickElem);
        focus("#search_q");
      }, 1000);
    });
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


