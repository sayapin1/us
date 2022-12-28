const express = require("express");
const router = express.Router();

const { Post, Comment, Like } = require("../models");
const { Op } = require("sequelize");
const authMiddleWare = require("../middlewares/auth-middleware");

// 전체 게시글 조회
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    // 오류 예제
    // try catch 있을때/없을때
    // const posts = await NonexistentCollection.find({});

    res.send(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// 특정 게시글 조회
router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    // 오류테스트
    // const postId = "63a11f34dee1fb38182cdb93234234";
    const post = await Post.findByPk(postId);

    // mongoose.set("strictQuery", false); 설명예제
    // const post = await post.find({ notInSchema: 1 });
    // // strictQuery true
    // const post = await post.find({});
    // // strictQuery false
    // const post = await post.find({ notInSchema: 1 });

    console.log(post);
    res.send(post);
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

// 게시글 작성
router.post("/posts", authMiddleWare, async (req, res) => {
  try {
    const { title, body, userName, password } = req.body;

    // 조기 리턴
    if (Object.keys(req.body).length !== 4) {
      return res.send({ message: "파라미터를 확인하세요" });
    }

    const posts = await Post.create({
      title,
      body,
      userName,
      password,
    });

    // res.json({posts});
    // res.json(posts);
    res.send(posts);
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

// 특정 게시글 수정
// 비밀번호 비교 후 비밀번호 일치할 때만 수정
router.put("/posts/:postId", authMiddleWare, async (req, res) => {
  // postId 값 다르게 주고 try catch 빼고 실행
  try {
    const { postId } = req.params;
    const { title, body, userName, password } = req.body;

    // 조기 리턴
    const post = await Post.findByPk(postId);
    if (post === null) {
      return res.status(400).send({ message: "🛑 게시글이 없습니다." });
    }

    if (Object.keys(req.body).length !== 4) {
      return res.status(400).send({ message: "파라미터를 확인하세요" });
    }

    const { password: _password } = await Post.findByPk(postId, "password");
    if (_password !== password) {
      return res.status(400).send({ message: "비밀번호를 확인하세요" });
    }

    const result = await Post.findByIdAndUpdate(
      postId,
      { title, body, userName, password },
      {
        new: true,
      }
    );

    console.log("result", result);

    res.send({ message: "success" });
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

// 특정 게시글 삭제
router.delete("/posts/:postId", authMiddleWare, async (req, res) => {
  try {
    const { postId } = req.params;
    const { password } = req.body;
    // 오류 테스트용
    // const postId = "63a11f34dee1fb38182cdb93234234";

    // 조기 리턴
    const _post = await Post.findByPk(postId);
    if (_post === null) {
      return res.status(400).send({ message: "🛑 게시글이 없습니다." });
    }

    if (Object.keys(req.body).length !== 1) {
      return res.status(400).send({ message: "파라미터를 확인하세요" });
    }

    const { password: _password } = await Post.findByPk(postId, "password");
    if (_password !== password) {
      return res.status(400).send({ message: "비밀번호를 확인하세요" });
    }

    // 게시글 삭제
    const post = await Post.findByIdAndDelete(postId);
    // 게시글에 속한 댓글들 삭제
    const comments = await Comment.destroy({ postId });

    console.log(comments);

    res.send(post);
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
