const express = require("express");
const app = express();

const loginRouter = require("./routers/login")
const registerRouter = require("./routers/register")

app.use(express.json());

app.use("/api", [
    registerRouter, loginRouter
]);

app.get("/", (req, res) => {
    res.send("Welcome to my page");
})

app.listen(8080, () => {
    console.log("서버 접속")
})