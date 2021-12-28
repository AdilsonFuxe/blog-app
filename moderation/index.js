const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/events', (req, res) => {});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
