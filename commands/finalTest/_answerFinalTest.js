/*CMD
  command: /answerFinalTest
  help: 
  need_reply: false
  auto_retry_time: 
  folder: finalTest

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// /answerFinalTest
let [indexStr, ansIndexStr] = params.split(":");
let index = parseInt(indexStr);
let ansIndex = parseInt(ansIndexStr);

let testData = User.getProp("current_final_test");
if (!testData) {
    Api.answerCallbackQuery({
        callback_query_id: request.id,
        text: "❌ Final test not started.",
        show_alert: true
    });
    return;
}

let allQuestions = loadAllFinalQuestions();
if (!allQuestions.length) {
    Api.answerCallbackQuery({
        callback_query_id: request.id,
        text: "❌ No final test data found.",
        show_alert: true
    });
    return;
}

let q = allQuestions[index];
let isCorrect = (q.correctIndex - 1) === ansIndex;

if (isCorrect) testData.score++;
User.setProp("current_final_test", testData);

let feedback = isCorrect
    ? "✅ <b>Correct!</b> 🎉"
    : `❌ <b>Incorrect!</b>\nThe correct answer is: <b>${formatText(q.options[q.correctIndex - 1])}</b>`;

let text = `<b>📝 Question ${index + 1} of ${allQuestions.length}</b>\n\n${formatText(q.question)}\n\n${feedback}`;
let keyboard = { inline_keyboard: [] };

if (index + 1 < allQuestions.length) {
    keyboard.inline_keyboard.push([
        { text: "➡ Next Question", callback_data: `/nextFinalTest ${index + 1}` }
    ]);
} else {
    keyboard.inline_keyboard.push([
        { text: "✅ Finish Test", callback_data: `/finishFinalTest` },
        { text: "🔄 Retake Test", callback_data: "/startFinalTest" }
    ]);
}

Api.editMessageText({
    chat_id: chat.chatId,
    message_id: request.message.message_id,
    text: text,
    parse_mode: "HTML",  // Changed to HTML
    reply_markup: keyboard
});
