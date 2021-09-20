# tcp-rooms
This application manages TCP/IP connections between multiple clients.

Run:
```
TCP_PORT=80 node ./src/index.js
```



Or with pm2:
```
npm install -g pm2
pm2 start ecosystem.config.js
```

test locally with
```
telnet 127.0.0.1
```

if not working try to run with admin access (due to using port 80).
