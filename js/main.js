'use strict'

window.onload = onInit

function onInit() {
    renderBtn('הוסף לאקסל')
    addBtnEventListener()
}

function renderBtn(txt) {
    const elMetapel = document.querySelector('font[alt="OWNER_METAPEL"]')
    if (!elMetapel) return

    const input = document.createElement('input')
    input.type = 'button'
    input.className = 'ticetsButton btn-add-ticket'
    input.value = txt
    input.tabIndex = 1

    const spacer = document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0")

    const container = document.createElement("div")
    container.appendChild(input)
    container.appendChild(spacer)
    container.style.display = 'inline-block'

    const elBtnContainer = document.querySelector('tbody tr:nth-of-type(17) td')
    elBtnContainer.insertBefore(container, elBtnContainer.firstChild)
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