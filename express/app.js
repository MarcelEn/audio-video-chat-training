const express = require('express');

const app = express();

require('express-ws')(app);

let streamer = false;

let watchers = [];

app.ws('/stream', function (ws, req) {
    if (!streamer) {
        streamer = true;
        ws.on('message', function (msg) {
            watchers.forEach(watcher => watcher.readyState !== 3 && watcher.send(msg))
            ws.send();
        });
        ws.on('close', function () {
            console.log("streamer disonnected")
            streamer = false;
        })
    }
});

let idCount = 0;

app.ws('/watch', function (ws, req) {
    ws.id = idCount++;
    watchers.push(ws);
    ws.on('close', function () {
        watchers.filter(watcher => watcher.id !== ws.id)
    })
});

app.use(express.static("public"));


app.listen(3000, () => console.log("listening on 3000"));