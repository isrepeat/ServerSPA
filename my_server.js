const http = require('http');           // для создания сервера
const fs   = require('fs').promises;    // для работы с файлами на хосте
const URL  = require('url');            // для парсинга url-запроса

// Загружаем список всех юзеров из файла (обязательно с кодировкой):
let UsersData;  fs.readFile(__dirname + '/resources/UsersData.txt','utf8').then(file => UsersData = JSON.parse(file));


const server = http.createServer((req, res) => 
{
    const URLparsed = URL.parse(req.url, true); // true -> обработать все параметры и записать их в объект query
    const url       = URLparsed.pathname;
    const query     = URLparsed.query;
    const pathes    = url.split('/').slice(1), file = pathes.slice(-1);
    
    console.log(pathes);
    console.log('url = '+req.url+'  =>  path = '+pathes.join(' ')+'  =>  file = '+file);
    console.log(query);
    
    
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
    else if(pathes[0] === 'signup')
    {
        if(req.method === 'POST')
        {
            let body = '';
            req.on('data', part => body += part)
            req.on('end' , () =>
            {
                let   USER = JSON.parse(body)
                let  USERS = {};

                let writed = true;  for(let user of UsersData) if(user.player == USER.player) writed = false;
                if (writed)  UsersData.push(USER);

                console.log(USER);
                const i = UsersData.indexOf(USER);
                USERS   = UsersData.map( user => {let{password, ...data}=user;  return data} )
                USER    = {index:i, ...USERS[i]};

                let outputDATA = [];
                outputDATA.push(writed);
                if(writed)
                outputDATA.push(USER),
                outputDATA.push(USERS), 
                fs.writeFile(__dirname + '/resources/UsersData.txt', JSON.stringify(USERS, null, 2));
                

                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(JSON.stringify(outputDATA));
            })
        }
    }
    else if(pathes[0] === 'login')
    {
        if(req.method === 'POST')
        {
            let body = '';
            req.on('data', part => body += part)
            req.on('end' , () =>
            {
                let USER      = JSON.parse(body);
                let USERS     = {};
                let logged    = false;  
                
                UsersData.forEach( (user,i) => 
                {
                    if(user.player==USER.player && user.password==USER.password) 
                    {
                        logged = true;
                        USERS  = UsersData.map( user => {let{password, ...data}=user;  return data} )
                        USER   = {index:i, ...USERS[i]};
                    }
                })

                let outputDATA = [];
                outputDATA.push(logged);
                if(logged)
                outputDATA.push(USER),
                outputDATA.push(USERS);
                        
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(JSON.stringify(outputDATA));
            })
        }
    }
    else if(pathes[0] === 'save')
    {
        if(req.method === 'POST')
        {
            let body = '';
            req.on('data', part => body += part)
            req.on('end' , () =>
            {
                let USER      = JSON.parse(body);
                let USERS     = {};
                let saved     = false;  

                UsersData.forEach( (user,i) => 
                {
                    if(i == USER.index) 
                    {
                        UsersData[i].count = USER.count;
                        saved  = true;
                        USERS  = UsersData.map( user => {let{password, ...data}=user;  return data} )
                    }
                })

                let outputDATA = [];
                outputDATA.push(saved);
                if(saved)
                outputDATA.push(USERS);
                        
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(JSON.stringify(outputDATA));
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

const port = process.env.PORT || 3000;
server.listen(port); 
