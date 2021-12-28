const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  res.send({});
});

app.get('/posts', (req, res) => {});

app.listen(4002, () => {
  console.log('Listening on 4002');
});
