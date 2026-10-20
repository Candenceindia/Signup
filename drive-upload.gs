// Google Apps Script: receives photos/videos/messages from the page and saves them to Drive.
// Deploy: script.google.com > New project > paste this > Deploy > New deployment
//   Type: Web app | Execute as: Me | Who has access: Anyone
// Copy the /exec URL into UPLOAD_URL in index.html.
const SECRET = "baby2027";                 // must match UPLOAD_KEY in index.html
const FOLDER_NAME = "Baby Reveal Uploads"; // created automatically in your Drive

function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents);
    if (p.key !== SECRET) return out("forbidden");
    const it = DriveApp.getFoldersByName(FOLDER_NAME);
    const folder = it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
    const safe = String(p.name || "file").replace(/[\\/:*?"<>|]/g, "_");
    const blob = Utilities.newBlob(Utilities.base64Decode(p.data), p.mime || "application/octet-stream", safe);
    const file = folder.createFile(blob);
    file.setDescription("From: " + (p.from || "unknown"));
    return out("ok");
  } catch (err) { return out("error: " + err); }
}
function out(t) { return ContentService.createTextOutput(t); }
