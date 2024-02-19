const express = require('express');
const app = express();
app.use(express.json());
app.use('/game/', require('./routes/game.router'));
app.listen(5001, () => console.log(`listening on ${5001}`));