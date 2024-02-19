const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json());
app.use('/game/', require('./routes/game.router'));

app.listen(PORT, () => console.log(`listening on ${PORT}`));