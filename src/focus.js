var find = require('find-js')

module.exports = function(selector) {
    find(document, selector).forEach(function(query) {
        query.focus()
    })
}
