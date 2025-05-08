'use strict'

function renderLabels1() {
    const labels = getLabels()
    const strHTML = labels.map(label => `<li style="background-color: ${label.color}"></li>`)

    document.querySelector('.label-list').innerHTML = strHTML.join('')
}