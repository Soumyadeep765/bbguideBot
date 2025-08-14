/*CMD
  command: /finishFinalTest
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

let testData = User.getProp("current_final_test");
if (!testData) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❌ No final test data found.",
    show_alert: true
  });
  return;
}

let lessonId = "final_test"; // unique ID for final test reward flag
let maxRewardSoFar = User.getProp(`${lessonId}-max-reward`) || 0; // max reward user ever earned

let task_meta = Bot.getProp("final_tasks_meta") || {};
let totalQuestions = task_meta.totalQuestions || 10;

let scorePercentage = (testData.score / totalQuestions) * 100;
let earnedReward = Math.round((reward_final_test * scorePercentage) / 100);

let text, keyboard;

if (earnedReward > maxRewardSoFar) {
  // user improved, pay difference
  let rewardDiff = earnedReward - maxRewardSoFar;
  user_reward += rewardDiff;

  TopBoardLib.addScore({
    value: rewardDiff,
    boardName: "reward"
  });

  User.setProp("user_reward", user_reward);
  User.setProp(`${lessonId}-max-reward`, earnedReward);

  text = `🎉 *Final Test Completed!*\n\nYour score: *${testData.score}* / *${totalQuestions}* (${scorePercentage.toFixed(1)}%)\n\n` +
         `You earned *${rewardDiff} ${reward_currency}* for improving your best performance! 🎊`;
} else if (earnedReward === 0) {
  // no reward this time

  text = `😔 *Final Test Completed!*\n\nYour score: *${testData.score}* / *${totalQuestions}* (${scorePercentage.toFixed(1)}%)\n\n` +
         `You did not earn any reward this time. Try again to improve!`;
} else {
  // reward same or less than max, no new reward given, but friendly message
  text = `ℹ️ *Final Test Completed!*\n\nYour score: *${testData.score}* / *${totalQuestions}* (${scorePercentage.toFixed(1)}%)\n\n` +
         `Your best reward remains *${maxRewardSoFar} ${reward_currency}*. Keep practicing to improve your score and earn more!`;
}

keyboard = {
  inline_keyboard: [
    [
      { text: "🔄 Retake Test", callback_data: "/startFinalTest" },
      { text: "🏠 Back to Home", callback_data: "/start" }
    ]
  ]
};

User.deleteProp("current_final_test");

Api.editMessageText({
  chat_id: chat.chatId,
  message_id: request.message.message_id,
  text: text,
  parse_mode: "Markdown",
  reply_markup: keyboard
});
