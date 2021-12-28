const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const posts = {};

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case 'PostCreated':
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    case 'CommentCreated':
      const { id, content, postId } = data;
      const post = posts[postId];
      post.comments.push({
        id,
        content,
      });
      break;
    default:
      break;
  }
  res.send({});
});

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.listen(4002, () => {
  console.log('Listening on 4002');
});
