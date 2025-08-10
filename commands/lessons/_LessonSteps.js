/*CMD
  command: /LessonSteps
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

let lessonId = params.split(":")[0];
let stepIndex = parseInt(params.split(":")[1]) || 1;

if (!lessonId || isNaN(stepIndex)) {
  Api.answerCallbackQuery({ callback_query_id: request.id, text: "❌ Invalid parameters.", show_alert: true });
  return;
}

let lesson = Bot.getProp(lessonId);
if (!lesson?.steps?.length) {
  Api.answerCallbackQuery({ callback_query_id: request.id, text: "❌ Lesson not found.", show_alert: true });
  return;
}

stepIndex = Math.max(1, Math.min(stepIndex, lesson.steps.length));
let stepData = lesson.steps[stepIndex - 1];
if (!stepData) {
  Api.answerCallbackQuery({ callback_query_id: request.id, text: "❌ Step not found.", show_alert: true });
  return;
}

let contentText = `📖 *Step ${stepIndex} of ${lesson.steps.length}*\n\n${stepData.text}`
  .replace(/\*\*(.*?)\*\*/g, '*$1*')
  .replace(/__(.*?)__/g, '_$1_');
if (stepData.video) contentText += `\n\n🎥 [Watch Tutorial](${stepData.video})`;
if (stepData.help) contentText += `\n💡 [Help Article](${stepData.help})`;

let keyboard = {
  inline_keyboard: [
    ...(stepData.extra?.reply_markup?.inline_keyboard || []),
    [
      ...(stepIndex > 1 ? [{ text: "⬅ Back", callback_data: `/LessonSteps ${lessonId}:${stepIndex - 1}` }] : []),
      { text: `${stepIndex}/${lesson.steps.length}`, callback_data: 'step_counter' },
      ...(stepIndex < lesson.steps.length 
        ? [{ text: "Next ➡", callback_data: `/LessonSteps ${lessonId}:${stepIndex + 1}` }] 
        : [{ text: "✅ Finish", callback_data: `/finishLesson ${lessonId}` }])
    ],
    [
      stepIndex === 1 
        ? { text: "⬅ Back", callback_data: `/startLesson ${lessonId}` }
        : { text: "🔄 Restart", callback_data: `/startLesson ${lessonId}` }
    ]
  ]
};

let currentHasPhoto = request.message?.photo?.length > 0;
let nextHasPhoto = stepData.photo;

try {
  if (currentHasPhoto && !nextHasPhoto) {
    // Only case where we need to delete and resend (photo → text)
    Api.deleteMessage({ chat_id: chat.chatId, message_id: request.message.message_id });
    Api.sendMessage({
      chat_id: chat.chatId,
      text: contentText,
      parse_mode: "Markdown",
      reply_markup: keyboard
    });
  } 
  else if (nextHasPhoto) {
    // Handle photo cases (both text→photo and photo→photo)
      Api.editMessageMedia({
        chat_id: chat.chatId,
        message_id: request.message.message_id,
        media: { type: "photo", media: stepData.photo, caption: contentText, parse_mode: "Markdown" },
        reply_markup: keyboard
      });
    } 
  
  else {
    // Default case (text→text)
    Api.editMessageText({
      chat_id: chat.chatId,
      message_id: request.message.message_id,
      text: contentText,
      parse_mode: "Markdown",
      reply_markup: keyboard
      
    });
  }

} catch (e) {
  Api.answerCallbackQuery({ callback_query_id: request.id, text: `⚠️ Error: ${e.message}`, show_alert: true });
}
