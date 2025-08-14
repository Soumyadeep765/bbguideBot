/*CMD
  command: /saveFinalTasks
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

if (!ADMINS.includes(user.telegramid)) return;
if (!content) return;

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

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const result = { questions: [] };
    const validationErrors = [];
    const requiredHeaders = ['id', 'question', 'options', 'correct index'];

    for (const reqHeader of requiredHeaders) {
        if (!headers.includes(reqHeader.toLowerCase())) {
            validationErrors.push(`Missing required column: ${reqHeader}`);
        }
    }

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length !== headers.length || row.every(c => !c.trim())) continue;

        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = (row[j] || '').trim();
        }

        if (!obj.id) validationErrors.push(`Row ${i + 1} is missing ID`);
        if (!obj.question) validationErrors.push(`Question ${obj.id} is missing text`);

        let options = [];
        if (obj.options) {
            options = obj.options
                .split('\n')
                .map(opt => opt.replace(/^\d+\.\s*/, '').trim())
                .filter(opt => opt.length > 0);
        } else {
            validationErrors.push(`Question ${obj.id} is missing options`);
        }

        let correctIndex = -1;
        if (obj['correct index']) {
            correctIndex = parseInt(obj['correct index'], 10);
            if (isNaN(correctIndex)) {
                validationErrors.push(`Question ${obj.id} has invalid correct index (not a number)`);
            } else if (correctIndex < 1 || correctIndex > options.length) {
                validationErrors.push(`Question ${obj.id} correct index is out of range (1-${options.length})`);
            }
        } else {
            validationErrors.push(`Question ${obj.id} is missing correct index`);
        }

        if (options.length >= 2 && !isNaN(correctIndex)) {
            result.questions.push({
                id: obj.id,
                question: obj.question,
                options: options,
                correctIndex: correctIndex
            });
        }
    }

    if (validationErrors.length > 0) {
        return {
            error: "Validation failed",
            details: validationErrors,
            questions: result.questions
        };
    }

    return result;
}

function saveInChunks(data, chunkSize, basePropName) {
    let chunkCount = 0;
    for (let i = 0; i < data.length; i += chunkSize) {
        chunkCount++;
        const chunk = data.slice(i, i + chunkSize);
        Bot.setProp(`${basePropName}_chunk_${chunkCount}`, chunk, "json");
    }
    return chunkCount;
}

const parsed = parseQuiz(content);
//Bot.inspect(parsed);

if (parsed.error) {
    Api.sendMessage({
        text: `❌ Failed to parse quiz questions due to validation errors.`
    });
    return;
}

if (!parsed.questions || parsed.questions.length === 0) {
    Api.sendMessage({
        text: `❌ No valid questions found in the CSV.`
    });
    return;
}

let chunkCount = 0;
if (parsed.questions.length > 10) {
    chunkCount = saveInChunks(parsed.questions, 10, "final_tasks");
} else {
    Bot.setProp("final_tasks", parsed.questions, "json");
    chunkCount = 1;
}
Bot.setProp("final_tasks_meta", {
    chunkCount: chunkCount,
    totalQuestions: parsed.questions.length,
    chunkSize: 10
}, "json");
Api.sendMessage({
    text: `✅ Quiz questions saved\n📦 Total questions: ${parsed.questions.length}\n📑 Stored in ${chunkCount} chunk(s)`
});
