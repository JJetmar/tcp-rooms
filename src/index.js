const net = require('net');
const fs = require('fs').promises;

const roomConnections = new Map();

// states
const LOGGED_IN = "LOGGED_IN";
const REQUIRE_ROOM_NAME = "REQUIRE_ROOM";
const REQUIRE_PASSWORD = "REQUIRE_PASSWORD";

const server = net.createServer((c) => {
    let state = REQUIRE_ROOM_NAME;
    let room;
    let password;

    c.on('end', () => {
        console.log('client disconnected');
    });

    c.write("Room: ")

    c.on('data', (data) => {
        switch (state) {
            case REQUIRE_ROOM_NAME:
                room = String(data).toLowerCase().trim();
                c.write("Password: ")
                state = REQUIRE_PASSWORD;
                break;
            case REQUIRE_PASSWORD:
                password = String(data).trim();
                fs.readFile('../resources/rooms.csv')
                    .then(data => String(data).split(/\r?\n/))
                    .then(data => data.map(lines => lines.split(/\s*;\s*/)))
                    .then(rooms => rooms.find(([roomName, roomPassword]) =>
                        roomName.toLowerCase() === room && roomPassword === password
                    ))
                    .then(([foundRoom = null]) => {
                        if (foundRoom) {
                            c.write(`Welcome to the ${foundRoom}.\r\n`);
                            roomConnections.set(room, [...roomConnections.get(room) || [], c]);
                            state = LOGGED_IN;
                        } else {
                            c.write(`Invalid credentials.\r\n`)
                            c.end()
                        }
                    });
                break;
            case LOGGED_IN:
                roomConnections.get(room)
                    .filter(connection => connection !== c)
                    .forEach(connection => connection.write(data));
                break;
        }
    });
});

server.on('error', (err) => {
    throw err;
});

server.listen(process.env.PORT || 8124, () => {
    console.log('server bound');
});
