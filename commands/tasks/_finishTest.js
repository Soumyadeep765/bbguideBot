/*CMD
  command: /finishTest
  help: 
  need_reply: false
  auto_retry_time: 
  folder: tasks

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

let lessonId = params;
let testData = User.getProp("current_test");
if (!testData) return;

let tasks = Bot.getProp(`task:${lessonId}`) || [];
let score = testData.score;
let total = tasks.length;

// Calculate score percentage
let percent = (score / total) * 100;

// Calculate reward proportional to performance (linear scale)
let reward = Math.round((score / total) * reward_per_lesson_task);

// If score is zero, no reward
if (score === 0) reward = 0;

// Get previous best reward for this lesson
let maxRewardSoFar = User.getProp(`${lessonId}-task-max-reward`) || 0;

let text = `🎉 *Test Finished!* 🎯\n\nYou scored *${score}* out of *${total}*.\n\n${
  score === total
    ? "🌟 Perfect! You nailed every question like a pro!"
    : score >= Math.ceil(total / 2)
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

if (reward > maxRewardSoFar) {
  let rewardDiff = reward - maxRewardSoFar;

  if (rewardDiff > 0) {
    TopBoardLib.addScore({
      value: rewardDiff,
      boardName: "reward"
    });

    user_reward += rewardDiff;
    User.setProp("user_reward", user_reward);

    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: `🎉 You earned ${rewardDiff} ${reward_currency} for improving your best performance!`
    });

    // Update max reward
    User.setProp(`${lessonId}-task-max-reward`, reward);
  }
} else if (reward === 0) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "😔 No reward this time. Try again to improve!"
  });
} else {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: `ℹ️ Your best reward remains ${maxRewardSoFar} ${reward_currency}. Keep practicing!`
  });
}

Api.editMessageText({
  chat_id: chat.chatId,
  message_id: request.message.message_id,
  text: text,
  parse_mode: "Markdown",
  reply_markup: keyboard
});

User.setProp("current_test", null);
