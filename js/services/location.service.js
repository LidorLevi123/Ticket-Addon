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

function extractMobileNumber(doc) {
  // 1. Find the image element with the onclick="popupsms(...)" attribute
  const smsImage = doc.querySelector('img[onclick^="popupsms("]');

  if (smsImage) {
    // 2. Get the parent <td> element
    const td = smsImage.closest('td');

    if (td) {
      // 3. Find the <font> element inside the <td>
      const fontElement = td.querySelector('font');

      if (fontElement) {
        // 4. Get the phone number text
        const phoneNumber = fontElement.textContent.trim();
        return phoneNumber
      }
    }
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

function extractPersonName(doc, bool) {
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
    return null;
  }

  // Optional: Log or return outerHTML (full HTML of the table) 

  return tableNode;
}

function extractDescription(doc) {
  const descriptionElement = doc.querySelector("#t_areaDescription");
  const descriptionText = descriptionElement?.value || "";

  return descriptionText;
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

function parseCommentsTable(tableElement, recid) {
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

    data.push({ title, date, description, handler, status });
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
    <div style="display: flex; margin-top: 10px; padding: 4px; border: 1px solid #ddd; background: #fff;alignt-items:center;justify-content:center;">
  <!-- Description first -->

    <font style="font-size: small;font-weight:bold; padding-block-end:25px;">${comment.date}&nbsp;</font><br>
    <div style="width:30px;"></div>
  <font style="text-align:right;white-space: pre-wrap;flex-grow: 1;font-size:small;">${comment.description}</font>
  <!-- Date, Handler, and Status -->
  <div>
    <font style="font-size: small; font-weight:bold;">${comment.handler}</font> - 
    <font style="font-weight: bold; color: green;font-size: small;">${comment.status}</font>
  </div>
</div>

  `).join('');

  // Full accordion content
  accordionCell.innerHTML = `
    <div id="accordion_${recid}" class="accordion-content" style="display: none;padding: 6px; background: #f5f5f5; border: 1px solid #ccc;justify-content:center;">
      <div style="margin-top: 15px;display: flex;justify-content:center;flex-direction: column;">
        <strong>הערות בפנייה:</strong>
        <div style="margin-top: 5px;display:flex;flex-direction:column;justify-content:center;">
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
    content.style.display = content.style.display === 'none' ? 'flex' : 'none';
  });
}

function addShareButtons(anchor, recid, personName, mobileNumber, location, description) {
  const td = anchor.closest("td");
  if (!td) return;

  if (!location) location = 'לא צויין';

  // Use Unicode escapes for emojis so no risk of encoding issues
  const textToShare =
    "פנייה מספר: " + recid + "\n" +      // 🔢
    "מיקום: " + location + "\n" +        // 📍
    "תיאור: " + description + "\n" +     // 📝
    "לקוח: " + personName + "\n" +       // 👤
    "נייד: " + mobileNumber;              // 📱

  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;

  // Copy to clipboard button
  const copyBtn = document.createElement("span");
  copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="-1 0 20 20">
  <g id="copy-4" transform="translate(-3 -2)">
    <path id="secondary" fill="#2ca9bc" d="M19,3H16V4a1,1,0,0,1-1,1H13a1,1,0,0,1-1-1V3H9A1,1,0,0,0,8,4V16a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V4A1,1,0,0,0,19,3Z"/>
    <path id="primary" d="M16,17v3a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V8A1,1,0,0,1,5,7H8" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    <path id="primary-2" data-name="primary" d="M19,3H9A1,1,0,0,0,8,4V16a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V4A1,1,0,0,0,19,3ZM12,4a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V3H12Z" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
  </g>
</svg>`
  copyBtn.title = "העתק ללוח";
  copyBtn.style.cursor = "pointer";
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(textToShare)
    .then(() => {
      showUserMsg(`פניה ${recid} הועתקה ללוח`)
    })
    .catch(() => {
      showErrorMsg('לא ניתן להעתיק ללוח')
    });
  };
  // const copyBtn = document.createElement("button");
  // copyBtn.innerText = "📋";
  // copyBtn.type = 'button'
  // copyBtn.title = "העתק ללוח";
  // copyBtn.style.cssText = "margin-left:5px; cursor:pointer; font-size:12px;";
  // copyBtn.onclick = () => {
  //   navigator.clipboard.writeText(textToShare)
  //   .then(() => {
  //     showUserMsg(`פניה ${recid} הועתקה ללוח`)
  //   })
  //   .catch(() => {
  //     showErrorMsg('לא ניתן להעתיק ללוח')
  //   });
  // };

  // WhatsApp share button with image
  const waBtn = document.createElement("a");
  waBtn.href = whatsappLink;
  waBtn.target = "_blank";
  waBtn.rel = "noopener noreferrer";
  waBtn.title = "שתף בוואטסאפ";
  waBtn.style.cssText = "margin-left:5px; font-size:12px; text-decoration:none; display:inline-block; vertical-align:middle;";

  const waIcon = document.createElement("img");
  waIcon.src = "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"; // You can use a local path instead
  waIcon.alt = "WhatsApp";
  waIcon.style.cssText = "width:16px; height:16px; vertical-align:middle;";

  waBtn.appendChild(waIcon);

  const container = document.createElement('div')
  container.style.display = 'flex'
  container.style.gap = '5px'
  container.style.justifyContent = 'center'
  container.style.marginBlockStart = '5px'

  // Append buttons to the <td>
  container.appendChild(copyBtn);
  container.appendChild(waBtn);

  td.appendChild(container)
}