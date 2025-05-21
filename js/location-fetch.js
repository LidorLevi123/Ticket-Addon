// === Storage Helpers ===
function getCachedTicket(recid) {
  return new Promise((resolve) => {
    chrome.storage.local.get([`ticket-${recid}`], (result) => {
      resolve(result[`ticket-${recid}`] || null);
    });
  });
}

function setCachedTicket(recid, data) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [`ticket-${recid}`]: data }, resolve);
  });
}

// === Main Logic ===
async function proccessTickets() {
  let lobbyCount = document.querySelector("body > table > tbody > tr.tbody > td > form > table > tbody > tr:nth-child(4) > td > font > input[type=text]").value;
  lobbyCount = lobbyCount.match(/\d+/);
  lobbyCount = lobbyCount ? parseInt(lobbyCount[0], 10) : null;

  const ticketAnchors = Array.from(document.querySelectorAll("a[href^='Add_Get_Tickets.asp?recid=']"));
  const photoSpans = Array.from(document.querySelectorAll('span[onmouseover*="photo"]'));
  const whatsappAnchors = Array.from(document.querySelectorAll('input[type="text"][value^="עדיפות:"]'));


  const filteredAnchors = ticketAnchors.filter((_, i) => i % 2 === 0);

  for (let idx = 0; idx < filteredAnchors.length; idx++) {
    const anchor = filteredAnchors[idx];
    const presonAnchor = photoSpans[idx];
    const whAnchor = whatsappAnchors[idx];
    const recid = anchor.href.match(/recid=(\d+)/)?.[1];
    if (!recid) continue;

    try {
      // 🔁 Check local cache
      let data = await getCachedTicket(recid);

      if (!data) {
        // ⏬ Fetch if not in cache
        const url = `https://pniot.ariel.ac.il/projects/tzmm/Add_Get_Tickets.asp?recid=${recid}`;
        const doc = await fetchAndParseHTML(url, "windows-1255");

        const location = extractFaultLocation(doc);
        const mobileNumber = extractMobileNumber(doc)
        const personPosition = extractPersonPosition(doc);
        //const personName = idx < lobbyCount ? extractPersonName(doc, 1) : extractPersonName(doc, 0);
        const personName = photoSpans[idx].textContent.trim()
        const date = extractDate(doc);
        const description = extractDescription(doc);
        const tableComments = extractComments(doc);
        const comments = tableComments ? parseCommentsTable(tableComments, recid) : [];

        data = {
          recid,
          location,
          mobileNumber,
          personPosition,
          personName,
          date,
          comments,
          description
        };

        await setCachedTicket(recid, data);
      }

      // 🧩 DOM Manipulation
      const {
        location, mobileNumber, personPosition,
        personName, date, comments, description
      } = data;

      if (location) appendLocationToAnchor(anchor, location);
      if (mobileNumber) appendMobileToAnchor(presonAnchor, mobileNumber);
      if (comments.length) {
        appendAccordionToTicketRow(
          anchor,
          location,
          mobileNumber,
          personPosition,
          personName,
          date,
          recid,
          comments,
        );
      }

      addShareButtons(whAnchor, recid, personName, mobileNumber, location, description);

    } catch (err) {
      console.error(`Error processing ticket ${recid}:`, err);
      chrome.storage.local.remove(`ticket-${recid}`);
    }
  }
}

proccessTickets();
