/*CMD
  command: /saveLesson
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
if(! content) return;
function parseLesson(csvText, { parseJSONFields = ['extra'] } = {}) {
    const rows = [];
    let currentRow = [];
    let currentValue = '';
    let insideQuotes = false;

    if (!csvText || typeof csvText !== 'string') return [];
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
            currentRow.push(currentValue.trim());
            currentValue = '';
        } else if (char === '\n' && !insideQuotes) {
            currentRow.push(currentValue.trim());
            rows.push(currentRow);
            currentRow = [];
            currentValue = '';
        } else {
            currentValue += char;
        }
    }

    if (currentValue.trim() || currentRow.length) {
        currentRow.push(currentValue.trim());
        rows.push(currentRow);
    }

    if (rows.length === 0) return [];

    const headers = rows[0].map(header => header.trim());
    const result = { lessons: [] };
    let currentLesson = null;

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length !== headers.length || row.every(cell => !cell.trim())) continue;

        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            let value = (row[j] || '').trim();
            const header = headers[j];

            if (parseJSONFields.includes(header) && 
                (value.startsWith('{') || value.startsWith('['))) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    
Bot.sendMessage(`Failed to parse JSON in ${header}:`, value);
                }
            }

            obj[header] = value;
        }

        if (obj.id && obj.lesson) {
            currentLesson = {
                id: obj.id,
                name: obj.lesson,
                description: obj.Description || '',
                steps: []
            };
            result.lessons.push(currentLesson);
        }

        if (currentLesson && obj.step) {
            currentLesson.steps.push({
                step: obj.step,
                text: obj.text || '',
                photo: obj.photo || '',
                video: obj['YouTube Video'] || '',
                help: obj.Help || '',
                extra: obj.extra || null
            });
        }
    }

    return result;
}
//Bot.inspect(parseLesson(content))
// Parse lessons
const parsed = parseLesson(content); // returns a JSON with lessons array

// Collect all lesson IDs
const lessonIds = [];

for (const lesson of parsed.lessons) {
  const key = lesson.id;
  const value = lesson;

  Bot.setProp(key, value);
  lessonIds.push(key);

  Api.sendMessage({
    text: `✅ ${key} saved.`
  });
}

// Store all lesson IDs in one prop
Bot.setProp("all_lesson", lessonIds, "json");

Api.sendMessage({
  text: `✅ ${parsed.lessons.length} lessons saved via setProp.\n📦 All IDs: ${JSON.stringify(lessonIds)}`
});
