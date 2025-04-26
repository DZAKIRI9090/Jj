const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { attackBot, stopAttack } = require('./src/attacker');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/start', async (req, res) => {
    const { ipport, protocol, cps, duration } = req.body;
    const [ip, port] = ipport.split(":");
    attackBot(ip, port || 25565, protocol, cps, duration);
    res.send('Attack started!');
});

app.post('/stop', (req, res) => {
    stopAttack();
    res.send('Attack stopped!');
});

app.listen(PORT, () => console.log(`Website running at http://localhost:${PORT}`));