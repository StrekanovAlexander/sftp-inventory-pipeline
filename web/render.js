export function renderStatusPage(status) {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>SFTP Inventory Feed</title>
            </head>
            <body>
                <h1>SFTP Inventory Feed</h1>
                
                <h2>Pipeline status</h2>
                
                <p>
                    Source SFTP:
                    <strong>${status.source}</strong>
                </p>

                <p>
                    Source file:
                    <strong>${status.sourceFile}</strong>
                </p>
            </body>
        </html>
    `;
}