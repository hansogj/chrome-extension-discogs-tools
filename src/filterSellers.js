var find = require("find-js");
window.discogs = window.discogs || {};
module.exports = function () {
  (function (w) {
    w.filterSellers = find(document, ".shortcut_navigable")
      .filter(function (sellerInfo, index, array) {
        var thisTitle = find(sellerInfo, ".seller_info li:first-child a").shift().text;

        return find(document, ".seller_info li:first-child a")
          .map(function (a) {return a.text;})
          .filter(function (title) {
            return title === thisTitle;
          })
          .length < 2 ;
      }).forEach(function (unique) {
        unique.style.display = "none"
      });
  }(window.discogs));
}
