// Importing express module
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
res.sendFile(__dirname + '/index.html');
});


app.post('/shotspotterevents', (req, res) => {
    console.log('saurabh11111111111' + req);
const { PacketType, PacketFormat } = req.body;
// const { authorization } = req.headers;
res.send({
	PacketType,
	PacketFormat
	// authorization,
});
});

app.listen(3000, () => {
console.log('Our express server is up on port 3000');
});
