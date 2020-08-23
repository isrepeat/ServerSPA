const http = require('http');       //import http from 'http'
const fs = require('fs').promises;  //import {promises as fs} from 'fs'

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => 
{
    const pathes = req.url.split('/').slice(1,-1);
    const file   = req.url.split('/').slice(-1);
    const url    = req.url;

    
    console.log(pathes);
    console.log(req.url+' => file = '+file+';  url = '+url);
    
    
    if(pathes[0] === 'resources')
    {
        if(pathes[1] === 'scripts')
        {
            fs.readFile(__dirname + url)
                .then(script => {    
                    res.setHeader("Content-Type", "text/javascript");
                    res.writeHead(200);
                    res.end(script);
                })
        }
        if(pathes[1] === 'images')
        {
            fs.readFile(__dirname + url)
                .then(file => {
                    res.setHeader('Content-Type', 'image/jpeg');
                    res.writeHead(200);
                    res.end(file);
                })   
        }
    }
    else
    {
        fs.readFile(__dirname + "/index.html")
            .then(contents => {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(contents);
            })
    }   
});


// adress my notebook in local wi-fi:
//server.listen(80, '192.168.1.105', () => console.log("server is running ...")); 
server.listen(port); 