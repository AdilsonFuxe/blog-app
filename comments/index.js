const expres = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = expres();
app.use(cors());
app.use(expres.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const status = 'pending';
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status });
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status,
    },
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Received event: ', req.body.type);

  const { type, data } = data;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        postId,
        id,
        status,
        content,
      },
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
