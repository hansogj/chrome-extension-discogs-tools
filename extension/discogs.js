(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.discogs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});