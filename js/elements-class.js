'use strict'

targetTicketIdContainer()
targetMainTicketList()

function targetTicketIdContainer() {
    const tds = document.querySelectorAll('td[title^="21"]:has(> input[type="checkbox"])')
    tds.forEach(td => td.classList.add('ticket-id-container'))
}

function targetMainTicketList() {
    const elTicketList = document.querySelector('form table tbody')
    elTicketList.classList.add('main-ticket-list')
}