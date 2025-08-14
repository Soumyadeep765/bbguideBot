/*CMD
  command: /nextFinalTest
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

// /nextFinalTest
let state = User.getProp("current_final_test");
if (!state) return;

let allQuestions = loadAllFinalQuestions();
if (!allQuestions.length) {
    Api.answerCallbackQuery({
        callback_query_id: request.id,
        text: "❌ No final test found.",
        show_alert: true
    });
    return;
}

// Move to next question
state.currentIndex++;
if (state.currentIndex >= allQuestions.length) {
    Api.editMessageText({
        chat_id: chat.chatId,
        message_id: request.message.message_id,
        text: "🎉 You’ve completed the final test!"
    });
    return;
}

User.setProp("current_final_test", state);
showFinalQuestion(allQuestions[state.currentIndex], state.currentIndex, allQuestions.length, request.message.message_id);
