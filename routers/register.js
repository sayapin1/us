const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');
const {User} = require('../models');

router.post('/register', async (req, res) => {
    const {nickname, password, confirmpw} = req.body;
    console.log(nickname)
    console.log(password)
    console.log(User)
    const nameReg = /^[a-zA-Z0-9]{3,}$/

    try {
        if (!nameReg.test(nickname)) {
            return res.status(412).send({"errorMessage": "ID의 형식이 일치하지 않습니다."})
        }

        if (password.length < 4) {
            return res.status(412).send({"errorMessage": "패스워드의 형식이 일치하지 않습니다."})
        }

        if (password === nickname) {
            return res.status(412).send({"errorMessage": "패스워드와 닉네임이 일치합니다."})
        }

        if (password !== confirmpw) {
            return res.status(412).send({"errorMessage": "패스워드가 일치하지 않습니다."})
        }


        const existUser = await User.findAll({
            where: {nickname: nickname}
        })

        if (existUser.length){
            return res.status(412).send({"errorMessage": "중복된 닉네임입니다."})
        }

        await User.create({
            nickname, password
        })


        res.status(201).send({message: "회원가입 성공!"})

    } catch(err) {
        res.status(400).send({"errorMessage": "요청한 데이터 형식이 올바르지 않습니다."})
    }


});

module.exports = router;