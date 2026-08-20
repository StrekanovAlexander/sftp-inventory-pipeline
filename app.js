import 'dotenv/config';
import http from 'http';

import { sourceConfig, destinationConfig } from './config/sftp.js';
import { checkSftpConnection } from './sftp/connection.js';
import { renderStatusPage } from './web/render.js';

const port = process.env.PORT || 3000;

const status = { 
    source: 'Not checked', 
    destination: 'Not checked' 
};

const server = http.createServer((req, res) => { 
    if (req.url === '/') { 
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); 
        res.end(renderStatusPage(status));
        return; 
    } 

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); 
    res.end('Not found'); 
});

async function runPipelineCheck() { 
    console.log('Checking SFTP connections...'); 
    status.source = 'Checking...'; 
    
    const sourceConnected = await checkSftpConnection(sourceConfig); 
    
    if (!sourceConnected) { 
        status.source = 'FAILED'; 
        throw new Error('Source SFTP connection failed.'); 
    } status.source = 'OK'; 
    
    console.log('Source SFTP connection: OK'); 
    status.destination = 'Checking...'; 
    
    const destinationConnected = await checkSftpConnection(destinationConfig); 
    
    if (!destinationConnected) { 
        status.destination = 'FAILED'; 
        throw new Error('Destination SFTP connection failed.'); 
    } 
    
    status.destination = 'OK'; 
    console.log('Destination SFTP connection: OK'); 
}

server.listen(port, '0.0.0.0', () => { 
    console.log(`HTTP server running on port ${port}`); 
    runPipelineCheck().catch(error => { 
        console.error('Pipeline check failed:', error.message); 
    }); 
});
