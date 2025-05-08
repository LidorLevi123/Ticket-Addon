'use strict';

const ticketTitles = document.querySelectorAll("a[href^='Add_Get_Tickets.asp?recid=']");

for (let i = 0; i < ticketTitles.length; i += 2) {
  const anchor = ticketTitles[i];
  const recid = anchor.href.match(/recid=(\d+)/)?.[1];

  if (!recid) continue;

  // Fetch ticket page
  fetch(`https://pniot.ariel.ac.il/projects/tzmm/Add_Get_Tickets.asp?recid=${recid}`, {
    credentials: "include"
  })
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const decoder = new TextDecoder("windows-1255");
      const decodedHtml = decoder.decode(buffer);

      const parser = new DOMParser();
      const doc = parser.parseFromString(decodedHtml, "text/html");

      const xpath = "//td[b[contains(text(),'מקום התקלה:')]]";
      const result = document.evaluate(xpath, doc, null, XPathResult.STRING_TYPE, null);
      const location = result.stringValue.trim();

      if (location.includes("מקום התקלה")) {

        // 🔽 Create and insert the location element under the ticket
        const td = anchor.closest("td"); // Get parent <td>
        const locationElem = document.createElement("div");
        locationElem.innerText = location.replace("מקום התקלה:", "").trim();
        locationElem.style.color = "black";
        locationElem.style.fontSize = "small";
        locationElem.style.marginTop = "2px";

        td.appendChild(locationElem);
      }
    })
    .catch(console.error);
}
