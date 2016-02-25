var find = require("find-js");

module.exports = function () {
  (function (w) {
    w.filterSellers = find(document, ".seller_info li:first-child a").map(function(seller){return seller.text;})
      .filter(function(name, index, array) {
        return array.filter(function(n) {return name === n}).length > 1; }).sort()
  }(window));
}
