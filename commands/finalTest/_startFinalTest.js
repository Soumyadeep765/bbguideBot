/*CMD
  command: /startFinalTest
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

// /startFinalTest
let allQuestions = loadAllFinalQuestions();

if (!allQuestions.length) {
    Api.answerCallbackQuery({
        callback_query_id: request.id,
        text: "❌ No final test found.",
        show_alert: true
    });
    return;
}

// Save progress
User.setProp("current_final_test", {
    currentIndex: 0,
    score: 0
});

// Show first question (edit current message)
showFinalQuestion(allQuestions[0], 0, allQuestions.length, request.message.message_id);
