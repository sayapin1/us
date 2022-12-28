const express = require("express");
const router = express.Router();

const { Post, Comment, Like } = require("../models");
const { Op } = require("sequelize");
const authMiddleWare = require("../middlewares/auth-middleware");

// 특정 게시글에 속한 댓글 전체 조회
router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;

    // 조기 리턴
    const post = await Post.findByPk(postId);
    if (post === null) {
      return res.status(400).send({ message: "🛑 게시글이 없습니다." });
    }
    const comment = await Comment.findAll({ order: [["createdAt", "desc"]] });

    res.send(comment);
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

// 특정 게시글에 속한 댓글 작성
router.post("/posts/:postId/comments", authMiddleWare, async (req, res) => {
  try {
    const post_id = req.params.postId;
    const { content } = req.body;
    const user_id = res.locals.user.userId;

    // 조기 리턴
    const post = await Post.findByPk(post_id);
    if (post === null) {
      return res.status(400).send({ message: "🛑 게시글이 없습니다." });
    }

    if (content === "") {
      return res.status(400).send("🛑 댓글 내용을 입력해주세요");
    }

    const comment = await Comment.create({
      content,
      post_id,
      user_id,
    });

    res.send(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// 특정 게시글에 속한 특정 댓글 수정
router.put(
  "/posts/:postId/comments/:commentId",
  authMiddleWare,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { content } = req.body;

      // 조기 리턴
      const post = await Post.findByPk(postId);
      if (post === null) {
        return res.status(400).send({ message: "🛑 게시글이 없습니다." });
      }

      const _comment = await Comment.findByPk(commentId);
      if (_comment === null) {
        return res.status(400).send({ message: "🛑 댓글이 없습니다." });
      }

      if (content === "") {
        return res.status(400).send("🛑 댓글 내용을 입력해주세요");
      }

      await Comment.update(
        {
          content: content,
        },
        { where: { commentId } }
      );

      res.send({ message: "success" });
    } catch (error) {
      console.error(error);

      res.status(500).send(error.message);
    }
  }
);

// 특정 게시글에 속한 특정 댓글 삭제
router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleWare,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;

      // 조기 리턴
      const post = await Post.findByPk(postId);
      if (post === null) {
        return res.status(400).send({ message: "🛑 게시글이 없습니다." });
      }

      const _comment = await Comment.findByPk(commentId);
      if (_comment === null) {
        return res.status(400).send({ message: "🛑 댓글이 없습니다." });
      }

      await Comment.destroy({
        where: { commentId },
      });

      res.send("삭제완료!");
    } catch (error) {
      console.error(error);

      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
