var find = require('find-js')

function labelAlert(labels, alertColor) {
    find(document, '.label_and_cat')
        .filter(labelAndCat =>
            labels.some(label => labelAndCat.innerText.match(label))
        )
        .map(match => {
            match.style.backgroundColor = alertColor[0]
            match.style.borderRadius = '5px'
            match.style.border = ['1px', 'solid']
                .concat(alertColor[1])
                .join(' ')

            return match
        })
}

labelAlert(
    [
        'Abkco',
        'Abraxas',
        'Akarma',
        'Bad Joker',
        'DOL',
        'DOXY',
        'Get Back',
        'Jazz Wax',
        'joe jackson recoords',
        'Lilith',
        'Music on Vinyl',
        'Sanctuary Records',
        'Simply Vinyl',
        'Skorpio',
        'Tapestry',
        'Vinyl Lovers',
        'Vinyl Magic (VM - BTF)',
        'WaxTime',
        'Waxtime In Color',
        'ZYX',
    ],
    ['#e28080', '#773636']
)

labelAlert(
    [
        'Cisco',
        'Mobile Fidelity',
        'Analogue Productions',
        'Audio Fidelity',
        "Speaker's Corner",
        'Moserobie Music Production',
    ],
    ['#81b179', '#0e4805']
)
