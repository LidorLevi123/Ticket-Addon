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
  console.log("lobbyCount", lobbyCount);

  const ticketAnchors = Array.from(document.querySelectorAll("a[href^='Add_Get_Tickets.asp?recid=']"));
  const photoSpans = Array.from(document.querySelectorAll('span[onmouseover*="photo"]'));
  const whatsappAnchors = Array.from(document.querySelectorAll('input[type="text"][value^="עדיפות:"]'));

  console.log("photoSpans", photoSpans.length);

  const tasks = ticketAnchors
    .filter((_, i) => i % 2 === 0)
    .map(async (anchor, idx) => {
      const presonAnchor = photoSpans[idx];
      const whAnchor = whatsappAnchors[idx];
      const recid = anchor.href.match(/recid=(\d+)/)?.[1];
      if (!recid) return;

      // 🔁 Try local cache first
      const cached = await getCachedTicket(recid);
      if (cached) {
        return { ...cached, anchor, presonAnchor, whAnchor };
      }

      // ⏬ Fetch if not in cache
      try {
        const url = `https://pniot.ariel.ac.il/projects/tzmm/Add_Get_Tickets.asp?recid=${recid}`;
        const doc = await fetchAndParseHTML(url, "windows-1255");

        const location = extractFaultLocation(doc);
        let mobileNumber = idx < lobbyCount
          ? extractMobileNumber(doc, 1)
          : extractMobileNumber(doc, 0);

        const personPosition = extractPersonPosition(doc);
        const personName = extractPersonName(doc);
        const date = extractDate(doc);
        const description = extractDescription(doc);
        const tableComments = extractComments(doc);
        const comments = tableComments ? parseCommentsTable(tableComments, recid) : [];

        const ticketData = {
          recid,
          location,
          mobileNumber,
          personPosition,
          personName,
          date,
          comments,
          description
        };

        await setCachedTicket(recid, ticketData);

        return {
          ...ticketData,
          anchor,
          presonAnchor,
          whAnchor
        };
      } catch (err) {
        console.error(`Error fetching ticket ${recid}:`, err);
      }
    });

  const results = await Promise.all(tasks);

  for (const result of results) {
    if (!result) continue;

    const {
      anchor, presonAnchor, whAnchor,
      location, mobileNumber, personPosition,
      personName, date, recid, comments, description
    } = result;

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
  }
}

proccessTickets();
