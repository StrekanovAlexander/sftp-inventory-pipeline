import fs from 'fs';

export async function transformFeed(inputFile, outputFile) {
    try {
        const content = fs.readFileSync(inputFile, 'utf8');

        function parsePipeCsv(text) {
            const rows = [];
            let row = [];
            let field = '';
            let insideQuotes = false;

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const next = text[i + 1];

                if (char === '"') {
                    if (insideQuotes && next === '"') {
                        field += '"';
                        i++;
                    } else {
                        insideQuotes = !insideQuotes;
                    }
                } else if (char === '|' && !insideQuotes) {
                    row.push(field);
                    field = '';
                } else if (
                    (char === '\n' || char === '\r') &&
                    !insideQuotes
                ) {
                    if (char === '\r' && next === '\n') {
                        i++;
                    }

                    row.push(field);
                    field = '';

                    if (row.some(value => value !== '')) {
                        rows.push(row);
                    }

                    row = [];
                } else {
                    field += char;
                }
            }

            if (field !== '' || row.length > 0) {
                row.push(field);

                if (row.some(value => value !== '')) {
                    rows.push(row);
                }
            }

            return rows;
        }

        const rows = parsePipeCsv(content);

        if (rows.length === 0) {
            throw new Error('Source file is empty.');
        }

        const originalHeaders = rows[0];

        const columns = originalHeaders
            .map((header, index) => ({
                header: header.trim(),
                index
            }))
            .filter(column => column.header !== 'engine_type');

        const outputHeaders = columns.map(column =>
            column.header.replace(/_/g, ' ')
        );

        const outputRows = [
            outputHeaders.join('\t')
        ];

        for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
            const sourceRow = rows[rowIndex];

            const outputRow = columns.map(column => {
                let value = sourceRow[column.index] ?? '';

                if (column.header === 'additional_image_link') {
                    value = value
                        .split('|')
                        .map(url => url.trim())
                        .filter(Boolean)
                        .join(',');
                }

                return value
                    .replace(/\r?\n|\r/g, ' ')
                    .replace(/\t/g, ' ');
            });

            outputRows.push(outputRow.join('\t'));
        }

        fs.writeFileSync(
            outputFile,
            outputRows.join('\n'),
            'utf8'
        );

        return true;

    } catch (error) {
        console.error('Feed transformation error:', error.message);

        return false;
    }
}