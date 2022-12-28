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

    const comment = await Comment.find({ postId }).sort({ createdAt: -1 });

    res.send(comment);
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

// 특정 게시글에 속한 댓글 작성
router.post("/posts/:postId/comments", authMiddleWare, async (req, res) => {
  try {
    const { postId } = req.params;
    const { body, userName } = req.body;

    // 조기 리턴
    const post = await Post.findByPk(postId);
    if (post === null) {
      return res.status(400).send({ message: "🛑 게시글이 없습니다." });
      // return 안붙였을때 에러 테스트
      // postID = 63a31e030f1338b7fba2990c
      // res.send({message: "🛑 게시글이 없습니다."});
    }

    if (Object.keys(req.body).length !== 2) {
      return res.status(400).send({ message: "파라미터를 확인하세요" });
    }

    if (body === "") {
      return res.status(400).send("🛑 댓글 내용을 입력해주세요");
    }

    const comment = await Comment.create({
      body,
      userName,
      postId,
    });

    console.log(comment);

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
      const { body, userName } = req.body;

      // 조기 리턴
      const post = await Post.findByPk(postId);
      if (post === null) {
        return res.status(400).send({ message: "🛑 게시글이 없습니다." });
      }

      const _comment = await Comment.findByPk(commentId);
      if (_comment === null) {
        return res.status(400).send({ message: "🛑 댓글이 없습니다." });
      }

      if (Object.keys(req.body).length !== 2) {
        return res.status(400).send({ message: "파라미터를 확인하세요" });
      }

      if (body === "") {
        return res.status(400).send("🛑 댓글 내용을 입력해주세요");
      }

      const result = await Comment.findByIdAndUpdate(
        commentId,
        {
          body,
          userName,
        },
        { new: true }
      );

      console.log("result", result);

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

      const comment = await Comment.findByIdAndDelete(commentId);

      res.send(comment);
    } catch (error) {
      console.error(error);

      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
