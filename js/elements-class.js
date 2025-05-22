'use strict'

targetTicketIdContainer()

function targetTicketIdContainer() {
    const tds = document.querySelectorAll('td[title^="21"]:has(> input[type="checkbox"])')
    tds.forEach(td => td.classList.add('ticket-id-container'))
}