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
// sheet id is not a sensitive information so no need to use prop 
const SHEET_ID = "1BDEvTqTpTWRSZf36ht41tokvfXIjPa-73CN-UNCgtSU"; // Main Google Sheet ID

// GID notes:
// Each tab (sheet) inside a Google Sheet has its own GID.
// Lessons tab = gid: 0 (first tab, default) → no need to store separately.
// Quiz/Task tab = use its actual gid from the sheet URL.
const TASK_GID = 1502133353; // Quiz/Task tab GID
const META_GID = 1462168692; // Bot meta tab GID
const FINAL_TASKS_GID = 17897518; // Final quiz/task tab GID
/* Example GID reference:
https://docs.google.com/spreadsheets/d/.../htmlview#gid=1502133353
At the end → gid=1502133353
*/

//reward settings 
let reward_currency = "BP";
let reward_per_lesson = 45;
let reward_per_lesson_task = 55;
let reward_final_test = 150;
//let reward_per_ai_task = 50;
//admin can decrease the reward and can give real BBP as reward for making bot attractive to users

// a useful function to get next lesson id
function getNextLessonId(currentId) {
  let allLessons = Bot.getProp("all_lesson") || [];
  let idx = allLessons.indexOf(currentId);
  if (idx >= 0 && idx < allLessons.length - 1) {
    return allLessons[idx + 1];
  }
  return null; // no next lesson to start automatically
}
//to get last lesson 
function getLastLessonId() {
  let allLessons = Bot.getProp("all_lesson") || [];
  if (allLessons.length === 0) return null;
  return allLessons[allLessons.length - 1];
}


// Session variables for tracking progress
let current_ongoing_lesson;
let user_reward;
// Only fetch user progress if `user` exists (avoids render issues in webapp)
if (user) {
  user_reward = User.getProp("user_reward") || 0;
  current_ongoing_lesson = User.getProp("current_ongoing_lesson") || null;
}

//shared functions for mainly finalTest folder commands

function loadAllFinalQuestions() {
    let allQuestions = [];
    let meta = Bot.getProp("final_tasks_meta");
    if (meta && meta.chunkCount > 1) {
        for (let i = 1; i <= meta.chunkCount; i++) {
            let chunk = Bot.getProp(`final_tasks_chunk_${i}`);
            if (chunk && Array.isArray(chunk)) {
                allQuestions = allQuestions.concat(chunk);
            }
        }
    } else {
        let singleSet = Bot.getProp("final_tasks");
        if (singleSet && Array.isArray(singleSet)) {
            allQuestions = singleSet;
        }
    }
    return allQuestions;
}

function formatText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '*$1*') // bold to markdown
        .replace(/__(.*?)__/g, '_$1_');    // underline to italic
}

function showFinalQuestion(q, index, total, messageId) {
    let text = `<b>📝 Question ${index + 1} of ${total}</b>\n\n${formatText(q.question)}\n\n`;

    q.options.forEach((opt, i) => {
        text += `${i + 1}. ${formatText(opt)}\n`;
    });

    let keyboard = { inline_keyboard: [] };
    q.options.forEach((opt, i) => {
        keyboard.inline_keyboard.push([
            { 
                text: `${i + 1} - ${opt}`, 
                callback_data: `/answerFinalTest ${index}:${i}` 
            }
        ]);
    });

    Api.editMessageText({
        chat_id: chat.chatId,
        message_id: messageId,
        text: text,
        parse_mode: "HTML",
        reply_markup: keyboard
    });
}
