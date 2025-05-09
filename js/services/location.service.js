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
    }else{
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
