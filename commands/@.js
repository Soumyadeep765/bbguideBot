/*CMD
  command: @
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/


const ADMINS = [6414701337]; // Our admin Telegram user IDs
const SHEET_ID = "1BDEvTqTpTWRSZf36ht41tokvfXIjPa-73CN-UNCgtSU"; // Main Google Sheet ID

// GID notes:
// Each tab (sheet) inside a Google Sheet has its own GID.
// Lessons tab = gid: 0 (first tab, default) → no need to store separately.
// Quiz/Task tab = use its actual gid from the sheet URL.
const TASK_GID = 1502133353; // Quiz/Task tab GID
const META_GID = 1462168692; // Bot meta tab GID
/* Example GID reference:
https://docs.google.com/spreadsheets/d/.../htmlview#gid=1502133353
At the end → gid=1502133353
*/

// Session variables for tracking progress
let current_ongoing_lesson;
let user_started_learning;
// Only fetch user progress if `user` exists (avoids render issues in webapp)
if (user) {
  user_started_learning = User.getProp("user_started_learning")|| false;
  current_ongoing_lesson = User.getProp("current_ongoing_lesson") || null;
}
