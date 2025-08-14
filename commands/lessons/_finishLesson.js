/*CMD
  command: /finishLesson
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

// /finishLesson command handler
let lessonId = params;
if (!lessonId) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❌ Lesson ID missing.",
    show_alert: true
  });
  return;
}

// Save user's current lesson
User.setProp("current_ongoing_lesson", lessonId);

// Get lesson data
let lesson = Bot.getProp(lessonId);
if (!lesson) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❌ Lesson not found.",
    show_alert: true
  });
  return;
}

// Congratulations message
let title = lesson.id.replace("L", "Lesson ");
let congratsText = `🎉 *Awesome job!*  

You’ve just completed *${title} - ${lesson.name}*! 💪  

That’s a big step forward in your learning journey. 🚀  

Now, let’s see how much you remember — ready for the test? 📝`;

// Inline keyboard: Restart lesson & Start test
let keyboard = {
  inline_keyboard: [
    [
      { text: "🔄 Restart Lesson", callback_data: `/startLesson ${lessonId}` },
      { text: "📝 Start Test", callback_data: `/startTest ${lessonId}` }
    ],
    [
          { text: "Go to home 🏡 ", callback_data: `/start` },
          
    ]
  ]
};

// Check if current message has photo
let hasPhotoNow = request.message?.photo?.length > 0;
let isPaidReward = User.getProp(`${lessonId}-paid`)
if(!isPaidReward){ 
  user_reward += reward_per_lesson;
  // Adding points to a user 
TopBoardLib.addScore({
   value: reward_per_lesson,
   boardName: "reward",
   //maxCount : 10, //default 10 so no need to pas , as we need 10 users in leaderboard 
});
  User.setProp("user_reward", user_reward)
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: `🎉 You got ${reward_per_lesson} ${reward_currency} for completing this lesson`
  });
  User.setProp(`${lessonId}-paid`, true)
  
}
if (hasPhotoNow) {
  // Can't edit into text → delete & send new
  Api.deleteMessage({
    chat_id: chat.chatId,
    message_id: request.message.message_id
  });

  Api.sendMessage({
    chat_id: chat.chatId,
    text: congratsText,
    parse_mode: "Markdown",
    reply_markup: keyboard
  });
} else {
  // Can edit text
  Api.editMessageText({
    chat_id: chat.chatId,
    message_id: request.message.message_id,
    text: congratsText,
    parse_mode: "Markdown",
    reply_markup: keyboard
  });
}
