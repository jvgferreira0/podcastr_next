const express = require('express')
const app = express()
const port = 3333

var fs = require('fs');
var db = JSON.parse(fs.readFileSync('server.json', 'utf8'));

for (let i = 0; i < db['episodes'].length; ++i) {
    const episode = db['episodes'][i];
    episode.previousEpisode = null;
    episode.nextEpisode = null;
    if (i > 0) {
        episode.previousEpisode = db['episodes'][i - 1].id;
    }

    if (i < db['episodes'].length - 1) {
        episode.nextEpisode = db['episodes'][i + 1].id;
    }
}

app.get('/episodes', (req, res) => {
    res.send(db['episodes']);
})

app.get('/episodes/:id', (req, res) => {
    const episode = db['episodes'].find(e => e.id == req.params.id);
    res.send(episode);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})