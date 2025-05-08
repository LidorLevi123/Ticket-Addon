'use strict'

const DEFAULT_TICKET_COLOR = '#e9e9e9'

var gSelectedColor
var gColoredElements = loadFromStorage('colored-els') || []

renderPaintImg()
addEventListeners()
renderColoredElements()

function renderColoredElements() {
    if(!gColoredElements.length) return

    gColoredElements.forEach(coloredEl => {
        document.querySelector(`[title="${coloredEl.title}"]`).style.backgroundColor = coloredEl.color
    })
}

function renderPaintImg() {
    const strHTML = `
    <label>
        <input type="color" style="opacity: 0">
        <img 
                src=${chrome.runtime.getURL('img/paint-roller.png')}
                class="paint-img"
                alt="Paint icon"
                title="סמן פניות באמצעות צבע"/>
    </label>
    <div class="color-dot"></div>
    `

    const elDiv = document.createElement('div')
    elDiv.classList.add('paint-container')
    elDiv.innerHTML = strHTML

    document.querySelectorAll('table')[1].querySelector('td font').appendChild(elDiv)
}

function addEventListeners() {
    document.querySelector('.paint-container input').addEventListener('change', (ev) => onSetColor(ev.target.value))
    document.addEventListener('mousemove', ev => {
        const colorDot = document.querySelector('.color-dot')

        colorDot.style.left = `${ev.clientX + 10}px`
        colorDot.style.top = `${ev.clientY + 10}px`
    })

    const elTicketList = document.querySelectorAll('table')[4]
    elTicketList.addEventListener('click', ev => {
        if (!gSelectedColor) return
        if (ev.target.style.backgroundColor === hexToRgb(gSelectedColor)) return

        gColoredElements.push({
            title: ev.target.title,
            el: ev.target,
            color: gSelectedColor,
            prevColor: ev.target.style.backgroundColor ? ev.target.style.backgroundColor : DEFAULT_TICKET_COLOR
        })

        ev.target.style.backgroundColor = gSelectedColor

        const colorDot = document.querySelector('.color-dot')

        colorDot.style.display = 'none';
        gSelectedColor = ''

        _saveColoredEls()
    })

    document.addEventListener('keydown', function (ev) {
        if ((ev.ctrlKey || ev.metaKey) && ev.key === 'z') {
            ev.preventDefault()

            if(!gColoredElements.length) return
            onUndoColor()
            _saveColoredEls()
        }
    })
}

function onUndoColor() {
    const prevColoredEl = gColoredElements.pop()

    if('style' in prevColoredEl.el) prevColoredEl.el.style.backgroundColor = prevColoredEl.prevColor
    else document.querySelector(`[title="${prevColoredEl.title}"]`).style.backgroundColor = prevColoredEl.prevColor
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