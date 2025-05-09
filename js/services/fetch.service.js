'use strict'


// fetchUtil.js

/**
 * Fetches and decodes an HTML page from the server using a specific encoding.
 * @param {string} url - Full URL to fetch.
 * @param {string} encoding - Character encoding (e.g., "windows-1255").
 * @returns {Promise<Document>} - Parsed HTML document.
 */
async function fetchAndParseHTML(url, encoding = "utf-8") {
  const response = await fetch(url, { credentials: "include" });
  const buffer = await response.arrayBuffer();
  const decodedHtml = new TextDecoder(encoding).decode(buffer);
  return new DOMParser().parseFromString(decodedHtml, "text/html");
}
