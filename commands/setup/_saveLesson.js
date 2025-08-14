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
if(!content) return;

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
    let validationErrors = [];

    // Validate headers
    const requiredHeaders = ['id', 'lesson', 'Description', 'step', 'text'];
    for (const reqHeader of requiredHeaders) {
        if (!headers.includes(reqHeader)) {
            validationErrors.push(`Missing required column: ${reqHeader}`);
        }
    }

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

        // Validate lesson fields
        if (obj.id && obj.lesson) {
            if (!obj.Description) {
                validationErrors.push(`Lesson ${obj.id} is missing description`);
            }
            
            if (!obj.lesson.trim()) {
                validationErrors.push(`Lesson ${obj.id} has empty name`);
            }

            currentLesson = {
                id: obj.id,
                name: obj.lesson,
                description: obj.Description || '',
                steps: []
            };
            result.lessons.push(currentLesson);
        }

        // Validate step fields
        if (currentLesson && obj.step) {
            if (!obj.text.trim()) {
                validationErrors.push(`Lesson ${currentLesson.id} step ${obj.step} has empty text`);
            }
            
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

    if (validationErrors.length > 0) {
        Api.sendMessage({
            text: `❌ Validation errors found:\n${validationErrors.join('\n')}`
        });
        return { error: "Validation failed", details: validationErrors };
    }

    return result;
}

const parsed = parseLesson(content);

if (parsed.error) {
    Api.sendMessage({
        text: `❌ Failed to parse lessons due to validation errors.`
    });
    return;
}

if (!parsed.lessons || parsed.lessons.length === 0) {
    Api.sendMessage({
        text: `❌ No valid lessons found in the CSV.`
    });
    return;
}

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
