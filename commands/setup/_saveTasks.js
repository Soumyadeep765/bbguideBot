/*CMD
  command: /saveTasks
  help: 
  need_reply: false
  auto_retry_time: 
  folder: setup

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if(!ADMINS.includes(user.telegramid)) return;
function parseQuiz(csvText) {
    const rows = [];
    let currentRow = [];
    let currentValue = '';
    let insideQuotes = false;

    if (!csvText || typeof csvText !== 'string') return {};

    const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentValue += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentValue);
            currentValue = '';
        } else if (char === '\n' && !insideQuotes) {
            currentRow.push(currentValue);
            rows.push(currentRow);
            currentRow = [];
            currentValue = '';
        } else {
            currentValue += char;
        }
    }

    if (currentValue || currentRow.length) {
        currentRow.push(currentValue);
        rows.push(currentRow);
    }

    if (rows.length === 0) return {};

    const headers = rows[0].map(h => h.trim());
    const grouped = {};

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length !== headers.length || row.every(c => !c.trim())) continue;

        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = (row[j] || '').trim();
        }

        let answersList = [];
        if (obj.answers) {
            answersList = obj.answers
                .split(/\n/)
                .map(a => a.replace(/^\d+\.\s*/, '').trim())
                .filter(Boolean);
        }

        const lessonId = obj.lesson_id;
        if (!grouped[lessonId]) {
            grouped[lessonId] = { tasks: [] };
        }

        grouped[lessonId].tasks.push({
            id: grouped[lessonId].tasks.length + 1,
            lesson_id: lessonId,
            question: obj.question,
            answers: answersList,
            correct_index: parseInt(obj.correct_index, 10)
        });
    }

    return grouped;
}

const parsed = parseQuiz(content); //retrun an json object 

for (const [lessonId, tasks] of Object.entries(parsed)) {
  let task = tasks?.tasks
  const key = `task:${lessonId}`;
  Bot.inspect(task)
  Bot.setProp(key, task, "json");
  Api.sendMessage({
    text: `✅ ${key} saved with ${task.length} quizzes.`
  });
}

Api.sendMessage({
  text: `✅ ${Object.keys(parsed).length} quiz groups saved via setProp.`
});
