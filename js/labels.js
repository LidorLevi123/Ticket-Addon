'use strict'

const DEFAULT_TICKET_COLOR = '#e9e9e9'

var gSelectedColor
var gColoredElements = loadFromStorage('colored-els') || []

renderLabels()
addEventListeners()
renderColoredElements()

function renderColoredElements() {
    if (!gColoredElements.length) return
    console.log(gColoredElements);
    
    gColoredElements.forEach(coloredEl => {
        const elColored = document.querySelector(`[title="${coloredEl.title}"]`)
        if(elColored) {
            elColored.style.backgroundColor = coloredEl.color
            elColored.dataset.isColored = true
        }
    })
}

function renderLabels() {
    const labels = getLabels()
    const strHTML = labels.map(label => `<li data-id=${label.id} style="background-color: ${label.color}"></li>`)
    const dotHTML = '<div class="color-dot"></div>'

    const elLabelList = document.createElement('ul')
    elLabelList.classList.add('label-list', 'clean-list')
    elLabelList.innerHTML = strHTML.join('') + dotHTML

    // Under stars of today
    document.querySelectorAll('table')[1].querySelector('td font').appendChild(elLabelList)
}

function addEventListeners() {
    document.querySelectorAll('.label-list li').forEach(elLabel => {
        elLabel.addEventListener('click', startColorMode)
    })
    document.addEventListener('mousemove', ev => {
        const colorDot = document.querySelector('.color-dot')

        colorDot.style.left = `${ev.clientX - 10}px`
        colorDot.style.top = `${ev.clientY - 13}px`
    })

    const elTicketList = document.querySelectorAll('table')[4]
    elTicketList.addEventListener('click', ev => {
        if (!gSelectedColor) return
        if (ev.target.style.backgroundColor === hexToRgb(gSelectedColor)) return

        const coloredEl = gColoredElements.find(coloredEl => coloredEl.title === ev.target.title)

        if(coloredEl) {
            coloredEl.color = gSelectedColor
        } else {
            gColoredElements.push({
                title: ev.target.title,
                color: gSelectedColor,
            })
        }

        ev.target.style.backgroundColor = gSelectedColor
        ev.target.dataset.isColored = true

        _saveColoredEls()
    })

    document.addEventListener('contextmenu', function (ev) {
        ev.preventDefault()

        if(ev.target.dataset.isColored) {
            ev.target.style.backgroundColor = DEFAULT_TICKET_COLOR
            delete ev.target.dataset.isColored
            gColoredElements = gColoredElements.filter(coloredEl => coloredEl.title !== ev.target.title)
            _saveColoredEls()
        } else {
            stopColorMode()
        }
    })
}

function startColorMode(ev) {
    const label = getLabelById(ev.target.dataset.id)
    onSetColor(label.color)
    document.body.style.cursor = 'grabbing'
}

function stopColorMode() {
    const colorDot = document.querySelector('.color-dot')

    colorDot.style.display = 'none';
    gSelectedColor = ''
    document.body.style.cursor = 'default'
}

function onSetColor(color) {
    gSelectedColor = color
    const colorDot = document.querySelector('.color-dot')

    colorDot.style.backgroundColor = color
    colorDot.style.display = 'block'
}

function hexToRgb(hex) {
    // Remove "#" if it exists
    hex = hex.replace(/^#/, '')

    // Expand shorthand form (e.g. "03F") to full form ("0033FF")
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('')
    }

    // Parse hex to RGB
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    return `rgb(${r}, ${g}, ${b})`
}

function _saveColoredEls() {
    saveToStorage('colored-els', gColoredElements)
}

//   document.querySelectorAll('table')[4].querySelectorAll('tr')[15].querySelectorAll('td')[0].style.backgroundColor