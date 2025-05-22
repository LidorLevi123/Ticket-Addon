'use strict'

var gMsgTimeout

renderUserMsg()

function renderUserMsg() {
    const elUserMsg = document.createElement('div')
    elUserMsg.classList.add('user-msg', 'hide')
    document.body.appendChild(elUserMsg)
}

function showErrorMsg(msg) {
    showUserMsg(msg, 'error')
}

function showUserMsg(msg, className = '') {
    if (gMsgTimeout) clearTimeout(gMsgTimeout)

    const elMsg = document.querySelector('.user-msg')
    elMsg.classList.remove('hide')
    elMsg.classList.remove('error')
    if (className) elMsg.classList.add(className)
    elMsg.innerText = msg

    gMsgTimeout = setTimeout(() => {
        elMsg.classList.add('hide')
    }, 2500)
}