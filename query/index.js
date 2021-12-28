const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const posts = {};

const handleEvents = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({
      id,
      content,
      status,
    });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  console.log('Received event: ', type);
  handleEvents(type, data);
  res.send({});
});

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.listen(4002, async () => {
  console.log('Listening on 4002');
  const res = await axios.get('http://localhost:4005/events');

  for (const event of res.data) {
    const { type, data } = event;
    console.log('Processing event: ', type);
    handleEvents(type, data);
  }
});
