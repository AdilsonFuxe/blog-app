const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const posts = {};

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  console.log('Received event: ', type);
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
  res.send({});
});

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.listen(4002, () => {
  console.log('Listening on 4002');
});
