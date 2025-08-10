/*CMD
  command: /finishTest
  help: 
  need_reply: false
  auto_retry_time: 
  folder: lessons

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// /finishTest command handler
let lessonId = params.trim();
let testData = User.getProp("current_test");
if (!testData) return;

let tasks = Bot.getProp(`task:${lessonId}`);
let score = testData.score;

let text = `🎉 *Test Finished!* 🎯\n\nYou scored *${score}* out of *${tasks.length}*.\n\n${
  score === tasks.length
    ? "🌟 Perfect! You nailed every question like a pro!"
    : score >= Math.ceil(tasks.length / 2)
    ? "💪 Great job! You’re on the right track—keep it up!"
    : "📚 Don’t worry! Every expert was once a beginner. Review the lesson and try again!"
}`;

let keyboard = {
  inline_keyboard: [
    [
      { text: "🔄 Retake Test", callback_data: `/startTest ${lessonId}` },
      { text: "⏭️ Next Lesson", callback_data: `/nextLesson ${lessonId}` }
    ],
      [
      { text: `🔃 Restart Lesson : ${lessonId}`, callback_data: `/startLesson ${lessonId}` }
    ],
        [
      { text: "Back to Home 🔙", callback_data: `/start` }
      ]
  ]
};

Api.editMessageText({
  chat_id: chat.chatId,
  message_id: request.message.message_id,
  text: text,
  parse_mode: "Markdown",
  reply_markup: keyboard
});

User.setProp("current_test", null);
