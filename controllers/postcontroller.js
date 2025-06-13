const blogPost = require("../data/blogPosts.js");
const connection = require("../data/db.js");
// INDEX

const index = (req, res) => {
  const sql = "SELECT * FROM posts";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(results);
  });
  res.json({
    description: "Lettura della lista dei post",
    data: blogPost,
  });
};

//SHOW

const show = (req, res) => {
  const postId = parseInt(req.params.id);
  const sql = "SELECT * FROM posts WHERE id = ?";
  connection.query(sql, [postId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length === 0)
      return res.status(404).json({ error: "Post not found" });
    res.json(results[0]);
  });
  // const post = blogPost.find((currentPost) => currentPost.id === id);
  // console.log(post);

  // // CHECK
  // if (!post) {
  //   res.status(404);
  //   req.json({
  //     error: 404,
  //     message: "post not found",
  //   });
  //   return;
  // }
  // res.json({
  //   description: "Lettura del dettaglio dei post" + id,
  //   data: post,
  // });
};

// STORE

const store = (req, res) => {
  const { title, content, image, tags } = req.body;
  const lastId = blogPost[blogPost.length - 1].id;
  const newId = lastId + 1;
  const newPost = { id: newId, title, content, image, tags };
  blogPost.push(newPost);

  res.status(201).json("Creazione del post" + newPost);
};

// UPDATE

const update = (req, res) => {
  const postId = parseInt(req.params.id);
  console.log(postId);
  let post = blogPost.find((currentPost) => currentPost.id === postId);

  //CHECK
  if (!post) {
    res.status(404);
    req.json({
      error: 404,
      message: "post inesistente",
    });
    return;
  }
  const { title, content, image, tags } = req.body;

  // post.title = title;
  // post.content = content;
  // post.image = image;
  // post.tags = tags;

  // console.log(blogPost);

  // EFFETTUO LA SOSTITUZIONE
  const updatePost = { id: postId, title, content, image, tags };
  const oldPostIndex = blogPost.indexOf(post);
  blogPost.splice(oldPostIndex, 1, updatePost);
  res.json(updatePost);
  // res.json("Modifica totale del post" + postId);
};

//DESTROY

const destroy = (req, res) => {
  const postId = parseInt(req.params.id);

  connection.query("DELETE FROM posts WHERE id = ?", [postId], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete post" });
    res.sendStatus(204);
  });
  // const post = blogPost.find((currentPost) => currentPost.id === id);

  // //CHECK POST ESISTENTE
  // const postIndex = blogPost.indexOf(post);
  // blogPost.splice(postIndex, 1);
  // console.log("Lista aggiornata:", blogPost);

  // //CHECK
  // if (!post) {
  //   res.status(404);
  //   req.json({
  //     error: 404,
  //     message: "post inesistente",
  //   });
  //   return;
  // }

  // res.status(204).send();
};

module.exports = { index, show, store, update, destroy };
