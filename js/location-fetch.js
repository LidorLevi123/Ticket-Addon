// Inject custom styles for the accordion
const style = document.createElement('style');
style.textContent = `
  .accordion-content {
    display: none; /* Initially hidden */
    padding: 10px;
    background: #f5f5f5;
    border: 1px solid #ccc;
    margin-top: 5px;
    transition: all 0.3s ease-in-out;
  }

  .accordion-toggle {
    cursor: pointer;
    text-decoration: underline;
    color: #007BFF;
  }
`;
document.head.appendChild(style);



console.log("location-fetch.js loaded");
async function proccessTickets() {
  let lobbyCount = document.querySelector("body > table > tbody > tr.tbody > td > form > table > tbody > tr:nth-child(4) > td > font > input[type=text]").value;
  lobbyCount = lobbyCount.match(/\d+/); // Matches one or more digits
  lobbyCount = lobbyCount ? parseInt(lobbyCount[0], 10) : null;
  console.log("lobbyCount", lobbyCount);
  const ticketAnchors = document.querySelectorAll("a[href^='Add_Get_Tickets.asp?recid=']");
  const photoSpans = document.querySelectorAll('span[onmouseover*="photo"]');
  console.log("photoSpans", photoSpans.length);
  for (let i = 0; i < ticketAnchors.length; i += 2) {
    const anchor = ticketAnchors[i];
    const presonAnchor = photoSpans[i / 2];
    const recid = anchor.href.match(/recid=(\d+)/)?.[1];
    if (!recid) continue;


    try {
      const url = `https://pniot.ariel.ac.il/projects/tzmm/Add_Get_Tickets.asp?recid=${recid}`;
      const doc = await fetchAndParseHTML(url, "windows-1255");
      const location = extractFaultLocation(doc);
      let mobileNumber = extractMobileNumber(doc);
      if (i / 2 < lobbyCount) {
        mobileNumber = extractMobileNumber(doc, 1);
      } else {
        mobileNumber = extractMobileNumber(doc, 0);
      }
      const personPosition = extractPersonPosition(doc);
      const personName = extractPersonName(doc);
      const date = extractDate(doc);
      if (location) appendLocationToAnchor(anchor, location);
      if (mobileNumber) appendMobileToAnchor(presonAnchor, mobileNumber);
      const tableComments = extractComments(doc);
      if (tableComments) {
        const comments = parseCommentsTable(tableComments, recid);
        appendAccordionToTicketRow(
          anchor,
          location,
          mobileNumber,
          personPosition,
          personName,
          date,
          recid,
          comments
        );
      }
    } catch (err) {
      console.error(`Error fetching ticket ${recid}:`, err);
    }
  }

}

proccessTickets();
