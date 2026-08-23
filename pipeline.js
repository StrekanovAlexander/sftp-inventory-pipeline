import 'dotenv/config';
import path from 'path';

import { sourceConfig } from './config/sftp.js';
import { checkSftpConnection } from './sftp/connection.js';
import { downloadFile } from './sftp/download.js';
import { transformFeed } from './transform/feed.js';

async function runPipeline() { 
    console.log('Checking SFTP connections...'); 
    const sourceConnected = await checkSftpConnection(sourceConfig); 
    
    if (!sourceConnected) { 
        throw new Error('Source SFTP connection failed.'); 
    } 
    
    console.log('Source SFTP connection: OK'); 

    const sourceFile = await downloadFile(
        sourceConfig,
        './vehicle_inventory_feed.csv',
        path.join(process.cwd(), 'data', 'vehicle_inventory_feed.csv')
    );

    if (!sourceFile) {
        throw new Error('Source file download failed.');
    }

    console.log('Source file download: OK');

    const transformed = await transformFeed(
        path.join(process.cwd(), 'data', 'vehicle_inventory_feed.csv'),
        path.join(process.cwd(), 'public', 'vehicle_inventory_feed.tsv')
    );

    if (!transformed) {
        throw new Error('Feed transformation failed.');
    }

    console.log('Feed transformation: OK');
}

runPipeline().catch(error => { 
    console.error('Pipeline failed:', error.message); 
}); 