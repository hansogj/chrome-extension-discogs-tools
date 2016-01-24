(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.addToCollection = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(r){if("object"==typeof exports)module.exports=r();else if("function"==typeof define&&define.amd)define(r);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.find=r()}}(function(){return function r(e,n,t){function o(f,u){if(!n[f]){if(!e[f]){var a="function"==typeof require&&require;if(!u&&a)return a(f,!0);if(i)return i(f,!0);throw new Error("Cannot find module '"+f+"'")}var l=n[f]={exports:{}};e[f][0].call(l.exports,function(r){var n=e[f][1][r];return o(n?n:r)},l,l.exports,r,e,n,t)}return n[f].exports}for(var i="function"==typeof require&&require,f=0;f<t.length;f++)o(t[f]);return o}({1:[function(r,e,n){r("array-from"),e.exports=function(r,e){return Array.from(r.querySelectorAll(e))}},{"array-from":2}],2:[function(r,e,n){e.exports="function"==typeof Array.from?Array.from:r("./polyfill")},{"./polyfill":3}],3:[function(r,e,n){e.exports=function(){var r=function(r){return"function"==typeof r},e=function(r){var e=Number(r);return isNaN(e)?0:0!==e&&isFinite(e)?(e>0?1:-1)*Math.floor(Math.abs(e)):e},n=Math.pow(2,53)-1,t=function(r){var t=e(r);return Math.min(Math.max(t,0),n)},o=function(r){if(null!=r){if("undefined"!=typeof Symbol&&"iterator"in Symbol&&Symbol.iterator in r)return Symbol.iterator;if("@@iterator"in r)return"@@iterator"}},i=function(e,n){if(null!=e&&null!=n){var t=e[n];if(null==t)return;if(!r(t))throw new TypeError(t+" is not a function");return t}},f=function(r){var e=r.next(),n=Boolean(e.done);return n?!1:e};return function(e){"use strict";var n,u=this,a=arguments.length>1?arguments[1]:void 0;if("undefined"!=typeof a){if(!r(a))throw new TypeError("Array.from: when provided, the second argument must be a function");arguments.length>2&&(n=arguments[2])}var l,c,y=i(e,o(e));if(void 0!==y){l=r(u)?Object(new u):[];var s=y.call(e);if(null==s)throw new TypeError("Array.from requires an array-like or iterable object");c=0;for(var d,p;;){if(d=f(s),!d)return l.length=c,l;p=d.value,a?l[c]=a.call(n,p,c):l[c]=p,c++}}else{var m=Object(e);if(null==e)throw new TypeError("Array.from requires an array-like object - not null or undefined");var v=t(m.length);l=r(u)?Object(new u(v)):new Array(v),c=0;for(var h;v>c;)h=m[c],a?l[c]=a.call(n,h,c):l[c]=h,c++;l.length=v}return l}}()},{}]},{},[1])(1)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){

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



},{"./focus":3,"find-js":1}],3:[function(require,module,exports){
var find = require("find-js");

module.exports = function(selector) {
  find(document,selector)
    .forEach(function (query) {query.focus();});
}

},{"find-js":1}]},{},[2])(2)
});