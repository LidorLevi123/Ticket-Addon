'use strict'

renderExcelImg()
renderTicketIndex()
renderTickets()
addBtnListeners()

function renderExcelImg() {
    const strHTML = `
            <img 
                src=${chrome.runtime.getURL('img/excel.png')}
                class="excel-img"
                alt="Excel icon"
                title="הצג רשימת פניות לייצוא אקסל"/>`

    const elDiv = document.createElement('div')
    elDiv.classList.add('excel-container')
    elDiv.innerHTML = strHTML

    document.body.appendChild(elDiv)
}

function renderTicketIndex() {
    const strHTML = `
        <div class="backdrop"></div>
        <section class="ticket-index">
            <button class="btn-close" title="סגור">x</button>
            <div class="title">
                <h2>הפניות שלך</h2>
                <button class="btn-reset" title="נקה טבלה">🗑️</button>
                <div class="btn-download" data-tooltip="Size: 20Mb">
                    <div class="btn-download-wrapper">
                        <div class="text">הורדה</div>
                            <span class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
                            </span>
                        </div>
                    </div>
                </div>
            <div class="tickets"></div>
        </section>`

    const elDiv = document.createElement('div')
    elDiv.innerHTML = strHTML
    elDiv.classList.add('html-addon')

    const elInjectedDiv = document.querySelector('.html-addon')

    if (elInjectedDiv) elInjectedDiv.innerHTML = strHTML
    else document.body.appendChild(elDiv)
}

function renderTickets() {
    const tickets = getTickets()
    const strHTML = tickets.length ?
        `<table class="ticket-table">
                <thead>
                    <tr>
                        <td>מספר פנייה</td>
                        <td>מיקום</td>
                        <td>שם</td>
                        <td>טלפון</td>
                        <td>תיאור</td>
                    </tr>
                </thead>
                <tbody class="ticket-list">
                ${tickets.map(ticket =>
            `<tr class="ticket-preview">
                        <td>${ticket.id}</td>
                        <td>${ticket.place}</td>
                        <td>${ticket.name}</td>
                        <td>${ticket.number}</td>
                        <td>${ticket.description}</td>
                    </tr>`).join('')}
                </tbody>
            </table>` : `<h2>אין פניות לייצוא תתחיל לעבוד</h2>`

    document.querySelector('.tickets').innerHTML = strHTML
}

function applyDnd() {
    const elTicketTable = document.querySelector(".ticket-list")

    new Sortable(elTicketTable, {
        animation: 250,
        onEnd: (ev) => {
            const evArr = Array.from(ev.from.children)
            const sortMap = evArr.reduce((acc, item, idx) => {
                acc[item.dataset.id] = idx
                return acc
            }, {})
            sortTickets(sortMap)
            renderTickets()
        }
    })
}

function downloadExcel() {
    const data = getTickets()

    // Convert the data into a worksheet
    const ws = XLSX.utils.json_to_sheet(data)

    ws['!cols'] = [
        { wch: 15 }, // Column 1 (ID)
        { wch: 20 }, // Column 2 (Place)
        { wch: 25 }, // Column 3 (Name)
        { wch: 15 }, // Column 4 (Phone Number)
        { wch: 40 }  // Column 5 (Description)
    ]

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")

    // Save the Excel file
    XLSX.writeFile(wb, "Tickets.xlsx")
}

function onResetTickets() {
    if (!confirm('אתה בטוח שאתה רוצה לנקות את הטבלה?')) return
    resetTickets()
    renderTickets()
    showUserMsg('טבלה נמחקה בהצלחה')
}

function addBtnListeners() {
    const elImg = document.querySelector('.excel-img')
    const elBtnClose = document.querySelector('.ticket-index .btn-close')
    const elBtnReset = document.querySelector('.ticket-index .btn-reset')
    const elDownloadExcel = document.querySelector('.ticket-index .btn-download')
    const elBackdrop = document.querySelector('.backdrop')

    elImg?.addEventListener('click', showTicketModal)
    elBackdrop?.addEventListener('click', closeTicketModal)
    elBtnClose?.addEventListener('click', closeTicketModal)
    elBtnReset?.addEventListener('click', onResetTickets)
    elDownloadExcel?.addEventListener('click', downloadExcel)
    // document.body.addEventListener('keydown', toggleTicketModal)
}

function toggleTicketModal(ev) {
    if (ev.code !== 'KeyX') return

    const elModal = document.querySelector('.ticket-index')
    const elBackdrop = document.querySelector('.backdrop')
    elModal.classList.toggle('active')
    elBackdrop.classList.toggle('active')
}

function showTicketModal() {
    const elModal = document.querySelector('.ticket-index')
    const elBackdrop = document.querySelector('.backdrop')
    elModal.classList.add('active')
    elBackdrop.classList.add('active')
}

function closeTicketModal() {
    const elModal = document.querySelector('.ticket-index')
    const elBackdrop = document.querySelector('.backdrop')
    elModal.classList.remove('active')
    elBackdrop.classList.remove('active')

    document.querySelector('.excel-container').classList.remove('ticket-added')
}