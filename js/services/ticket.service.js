'use strict'

const STORAGE_KEY = 'ticketDB'

var gTickets = loadFromStorage(STORAGE_KEY) || []

function getTickets() {
    return gTickets
}

function getById(ticketId) {
    const ticket = gTickets.find(ticket => ticket.id === ticketId)
    return ticket ? ticket : null
}

function sortTickets(sortMap) {
    gTickets.sort((t1,t2)=> sortMap[t1.id] - sortMap[t2.id])
    _saveTickets()
}

function addTicket(ticket) {
    gTickets.push(ticket)
    _saveTickets()
}

function removeTicket(ticketId) {
    gTickets = gTickets.filter(ticket => ticket.id !== ticketId)
    _saveTickets()
}

function resetTickets() {
    gTickets = []
    _saveTickets()
}

function _saveTickets() {
    saveToStorage(STORAGE_KEY, gTickets)
}