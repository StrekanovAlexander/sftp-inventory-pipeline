import http from 'http';
import { renderPage } from './web/render.js';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => { 
    if (req.url === '/') { 
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); 
        res.end(renderPage());
        return; 
    } 

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); 
    res.end('Not found'); 
});

server.listen(port, '0.0.0.0', () => { 
    console.log(`HTTP server running on port ${port}`); 
});
