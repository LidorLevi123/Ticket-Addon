// locationUtil.js

/**
 * Extracts the "fault location" string from a parsed HTML document.
 * @param {Document} doc
 * @returns {string|null}
 */
function extractFaultLocation(doc) {
    const xpath = "//td[b[contains(text(),'מקום התקלה:')]]";
    const result = document.evaluate(
        xpath,
        doc,
        null,
        XPathResult.STRING_TYPE,
        null
    );
    const location = result.stringValue.trim();
    return location.includes("מקום התקלה")
        ? location.replace("מקום התקלה:", "").trim()
        : null;
}
///html/body/table[2]/tbody/tr[4]/td/table/tbody/tr/td[2]/font[2]/b
function extractMobileNumber(doc,bool) {
  let xpath =''
  if (bool){
    xpath = '//html/body'; // Specific XPath for index 13
  }else{
    xpath = `(//table)[${13}]//tbody/tr/td[3]/font`;
  }
   
    const result = document.evaluate(
        xpath,
        doc,
        null,
        XPathResult.STRING_TYPE,
        null
    );
    if (bool){
      return result.stringValue.trim().match(/05\d{8}/g)[0];
    }
    else{
      const mobileNumber = result.stringValue.trim();
      return mobileNumber.trim();
    }
}

function extractPersonPosition(doc) {
    const xpath = "(//table)[13]//tbody/tr/td[1]/font";
    const result = document.evaluate(
        xpath,
        doc,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    const positionText = result.stringValue.trim();

    return positionText.trim();
}

function extractPersonName(doc) {
  const xpath = "(//table)[13]//tbody/tr/td[2]/font";
  const result = document.evaluate(
      xpath,
      doc,
      null,
      XPathResult.STRING_TYPE,
      null
  );

  let personName = result.stringValue.trim();

  // Remove anything inside parentheses
  personName = personName.replace(/\(.*?\)/g, '');

  // Remove any digits (standalone IDs)
  personName = personName.replace(/\d+/g, '');

  // Trim again to clean up spaces
  personName = personName.trim();

  return personName;
}

function extractDate(doc) {
  const xpath = "(//table)[13]//tbody/tr/td[5]/font";
  const result = document.evaluate(
      xpath,
      doc,
      null,
      XPathResult.STRING_TYPE,
      null
  );
  const date = result.stringValue.trim();
  return date.trim();
}

function extractComments(doc) {
  const xpath = "(//table)[16]";
  const result = document.evaluate(
    xpath,
    doc,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  const tableNode = result.singleNodeValue;

  if (!tableNode) {
    console.warn("No table found at that XPath.");
    return null;
  }

  // Optional: Log or return outerHTML (full HTML of the table) 

  return tableNode;
}


/**
 * Appends a location message under the relevant anchor's parent <td>.
 * @param {HTMLElement} anchor
 * @param {string} location
 */
function appendLocationToAnchor(anchor, location) {
    const td = anchor.closest("td");
    if (!td) return;

    const locationElem = document.createElement("div");
    locationElem.innerText = location;
    locationElem.style.color = "black";
    locationElem.style.fontSize = "small";
    locationElem.style.marginTop = "2px";

    td.appendChild(locationElem);
}

function appendMobileToAnchor(anchor, mobileNumber) {
  const td = anchor.closest("td");
  if (!td) return;

  const mobileElem = document.createElement("div");
  mobileElem.innerText = mobileNumber;
  mobileElem.style.color = "black";
  mobileElem.style.fontSize = "small";
  mobileElem.style.marginTop = "2px";

  td.appendChild(mobileElem);
}

function parseCommentsTable(tableElement,recid) {
  const rows = tableElement.querySelectorAll("tbody tr");
  const data = [];

  // Skip header row (first row)
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td");

    const date = cells[0]?.innerText.trim().replace(/\n/g, " ");
    const description = cells[1]?.innerText.trim();
    const handler = cells[2]?.innerText.trim();
    const status = cells[3]?.innerText.trim();
    const title = recid

    data.push({ title,date, description, handler, status });
  }

  return data;
}

function appendAccordionToTicketRow(anchor, location, mobileNumber, personPosition, personName, date, recid, comments) {
  const ticketRow = anchor.closest("tr");
  if (!ticketRow) return;

  // Filter comments for this specific ticket
  const ticketComments = comments.filter(c => c.title === recid);

  // Create the accordion row and cell
  const accordionRow = document.createElement("tr");
  const accordionCell = document.createElement("td");
  accordionCell.colSpan = ticketRow.children.length;

  // Build the HTML for comments
  const commentHTML = ticketComments.map(comment => `
    <div style="margin-top: 10px; padding: 8px; border: 1px solid #ddd; background: #fff;">
      <strong>${comment.date}</strong><br>
      <span style="font-weight: bold;">${comment.handler}</span> - 
      <span style="color: green;">${comment.status}</span><br>
      <div style="white-space: pre-wrap;">${comment.description}</div>
    </div>
  `).join('');

  // Full accordion content
  accordionCell.innerHTML = `
    <div id="accordion_${recid}" class="accordion-content" style="display: none; padding: 10px; background: #f5f5f5; border: 1px solid #ccc;">
      <div style="margin-top: 15px;">
        <strong>Comments:</strong>
        <div style="margin-top: 5px;">
          ${commentHTML || '<em>No comments found.</em>'}
        </div>
      </div>
    </div>
  `;

  accordionRow.appendChild(accordionCell);
  ticketRow.parentNode.insertBefore(accordionRow, ticketRow.nextSibling);

  // Toggle accordion
  anchor.style.cursor = 'pointer';
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const content = accordionCell.querySelector('.accordion-content');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
  });
}