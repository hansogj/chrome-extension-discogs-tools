var find = require('find-js')
window.discogs = window.discogs || {}

module.exports = function() {
    ;(function(w) {
        var colums = find(document, '.release_list_table tbody tr')
        var releasePattern = /[(master)|(release)]\/(\d+)/

        function getReleaseLinks(release) {
            return find(release, '.release_title_link a').filter(function(a) {
                return a.href.match(releasePattern).length
            })
        }

        function getReleaseId(releaseLink) {
            return releaseLink.href.match(/[(master)|(release)]\/(\d+)/).pop()
        }

        function getArtist(release) {
            find(release, '.release_title.set_height a')
                .filter(function(a, i) {
                    return i === 0
                })
                .map(function(a) {
                    return a.innerText
                })
                .pop()
        }

        function buildModel(all, release) {
            return getReleaseLinks(release)
                .map(function(link) {
                    return {
                        artist: getArtist(release),
                        title: link.innerText,
                        id: getReleaseId(link),
                        rel: release,
                    }
                })
                .shift()
        }

        function uniqueRelease(release, index, list) {
            function comparator(_release, _index) {
                return (
                    release.title.toLowerCase() ===
                        _release.title.toLowerCase() && index < _index
                )
            }

            return list.filter(comparator).length
        }

        function hide(elem) {
            elem.classList.add('hidden')
        }

        function addCss() {
            var css =
                    'tr {display:table-row; transition: all .2s ease-out; }' +
                    '.hidden {display:none;}',
                head =
                    document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style')

            style.type = 'text/css'
            if (style.styleSheet) {
                style.styleSheet.cssText = css
            } else {
                style.appendChild(document.createTextNode(css))
            }

            head.appendChild(style)
        }

        addCss()

        var hidden = colums
            .map(buildModel.bind(this, colums))
            .filter(uniqueRelease)
            .map(function(rel) {
                hide(rel.rel)
                return rel
            })

        console.log(
            hidden.map(function(rel) {
                return rel.artist + ': ' + rel.title
            })
        )
    })(window.discogs)
}
