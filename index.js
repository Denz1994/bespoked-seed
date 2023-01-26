const express = require('express');
const cors = require('cors');
const dbGenerator = require('./dbServices/dbGenerator');

const app = express();
app.use(cors());
app.use(express.json());

port = '5000';
app.listen(port, () => {
    console.log(`Server listening on ${port}`);
})