const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/requireAuth");
const { createPost, getAllPosts, getPostById, getMyPosts, deletePost } = require("../controllers/postController");

router.get("/fetch", requireAuth, getMyPosts);
router.get('fetch-all', getAllPosts);
router.get('/fetch/:id', getPostById);
router.post("/create", requireAuth, createPost);
router.delete('/delete/:id', requireAuth, deletePost);


module.exports = router;