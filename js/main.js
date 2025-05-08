'use strict'

var gMsgTimeout

window.onload = onInit

function onInit() {
    renderBtn('הוסף לאקסל')
    renderUserMsg()
    addBtnEventListener()
}

function renderBtn(txt) {
    const elMetapel = document.querySelector('font[alt="OWNER_METAPEL"]')
    if(!elMetapel) return

    const strHTML = `
        <input 
            type="button" 
            class="ticetsButton btn-add-ticket" 
            value="${txt}"
            name="cmbEnter" 
            tabindex="1">

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									
									

									
													
            `
    const elBtnContainer = document.querySelector('tbody tr:nth-of-type(17) td')
    elBtnContainer.innerHTML = strHTML + elBtnContainer.innerHTML
}

function renderUserMsg() {
    const elUserMsg = document.createElement('div')
    elUserMsg.classList.add('user-msg', 'hide') 
    document.body.appendChild(elUserMsg)
}

function onAddTicket() {
    const id = document.querySelectorAll('tr td')[70].childNodes[3].innerText.trim()
    const ticket = getById(id)
    if (ticket) {
        showErrorMsg('הפניה כבר אצלך בטבלה')
        return
    }

    const name = document.querySelector('#earth2').innerText.trim()
    const number = document.querySelectorAll('tbody')[16].querySelector('td:nth-of-type(3)').innerText.trim()
    const place = document.querySelectorAll('tr td')[129].childNodes[1].data.trim()
    const description = document.querySelectorAll('tr td')[130].querySelector('textarea').value.trim()

    const ticketToAdd = { id, name, number, place, description }
    addTicket(ticketToAdd)
    renderTickets()
    showUserMsg('פנייה נוספה בהצלחה')
    document.querySelector('.excel-container').classList.add('ticket-added')
}

function addBtnEventListener() {
    const elBtn = document.querySelector('.btn-add-ticket')
    elBtn?.addEventListener('click', onAddTicket)
}

function showErrorMsg(msg) {
    showUserMsg(msg, 'error')
}

function showUserMsg(msg, className = '') {
    if (gMsgTimeout) clearTimeout(gMsgTimeout)

    const elMsg = document.querySelector('.user-msg')
    elMsg.classList.remove('hide')
    elMsg.classList.remove('error')
    if(className) elMsg.classList.add(className)
    elMsg.innerText = msg

    gMsgTimeout = setTimeout(() => {
        elMsg.classList.add('hide')
    }, 2500)
}