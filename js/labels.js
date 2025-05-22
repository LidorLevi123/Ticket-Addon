'use strict'

const DEFAULT_TICKET_COLOR = '#e9e9e9'

var gSelectedColor
var gColoredElements = loadFromStorage('colored-els') || []

renderLabels()
addEventListeners()
renderColoredElements()

function renderColoredElements() {
    if (!gColoredElements.length) return

    gColoredElements.forEach(coloredEl => {
        const elColored = document.querySelector(`[title="${coloredEl.title}"]`)
        if (elColored) {
            elColored.style.backgroundColor = coloredEl.color
            elColored.dataset.isColored = true
        }
    })
}

function renderLabels() {
    const labels = getLabels()
    const strHTML = labels.map(label => `<li data-id=${label.id} title="${label.title}" style="background-color: ${label.color}"></li>`)
    const dotHTML = '<div class="color-dot"></div>'

    const elLabelList = document.createElement('ul')
    elLabelList.classList.add('label-list', 'clean-list')
    elLabelList.innerHTML = strHTML.join('') + dotHTML

    // Under stars of today
    document.querySelector('.sh td > font').appendChild(elLabelList)
}

function addEventListeners() {
    addPickListener()
    addDotListener()
    addColorListener()
    addUndoListener()
}

function addPickListener() {
    document.querySelectorAll('.label-list li').forEach(elLabel => {
        elLabel.addEventListener('click', startColorMode)
    })
}

function addDotListener() {
    document.addEventListener('mousemove', ev => {
        const colorDot = document.querySelector('.color-dot')

        colorDot.style.left = `${ev.clientX - 10}px`
        colorDot.style.top = `${ev.clientY - 13}px`
    })
}

function addColorListener() {
    const elTicketList = document.querySelector('form table')
    elTicketList.addEventListener('click', ev => {
        if (!gSelectedColor) return

        let el = ev.target
        if (!ev.target.title) {
            // Handle case where user clicks on location div
            el = ev.target.offsetParent
        }
        if (!el.title.startsWith('21')) return
        if (ev.target.style.backgroundColor === hexToRgb(gSelectedColor)) return

        const coloredEl = gColoredElements.find(coloredEl => coloredEl.title === el.title)

        if (coloredEl) {
            coloredEl.color = gSelectedColor
        } else {
            gColoredElements.push({
                title: el.title,
                color: gSelectedColor,
            })
        }

        el.style.backgroundColor = gSelectedColor
        el.dataset.isColored = true

        _saveColoredEls()
    })
}

function addUndoListener() {
    document.addEventListener('contextmenu', function (ev) {
        ev.preventDefault()

        let el = ev.target
        if (!ev.target.title) {
            // Handle case where user clicks on location div
            el = ev.target.offsetParent
        }

        if (el.dataset.isColored) {
            el.style.backgroundColor = DEFAULT_TICKET_COLOR
            el.style.boxShadow = `inset 0px 0px 6px 2px ${gSelectedColor}`
            delete el.dataset.isColored
            gColoredElements = gColoredElements.filter(coloredEl => coloredEl.title !== el.title)
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

    document.querySelectorAll('.ticket-id-container').forEach(td => {
        if(!td.dataset.isColored) {
            td.style.boxShadow = `inset 0px 0px 6px 2px ${label.color}`
        }
    })
}

function stopColorMode() {
    const colorDot = document.querySelector('.color-dot')

    colorDot.style.display = 'none';
    gSelectedColor = ''
    document.body.style.cursor = 'default'

    document.querySelectorAll('.ticket-id-container').forEach(td => td.style.boxShadow = 'none')
}

function onSetColor(color) {
    gSelectedColor = color
    const colorDot = document.querySelector('.color-dot')

    colorDot.style.backgroundColor = color
    colorDot.style.display = 'block'
}

function _saveColoredEls() {
    saveToStorage('colored-els', gColoredElements)
}