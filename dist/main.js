"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.post('/registration', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || username === "" || password === "") {
        res.status(400).send({
            message: "Username & Password is required"
        });
        return;
    }
    const isExists = db_1.users.find((user) => {
        if (user.username === username) {
            return user;
        }
    });
    if (isExists) {
        res.status(400).send({
            message: `${username} уже создан!!!`
        });
    }
    const newUser = {
        id: Date.now(),
        password,
        username
    };
    db_1.users.push(newUser);
    res.send({
        message: "User Created",
        users: newUser
    });
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const isExists = db_1.users.find((user) => user.username === username);
    if (!isExists) {
        res.status(401).send({
            message: `${username} not found`
        });
        return;
    }
    if (!isExists?.password !== password) {
        res.status(401).send({
            message: `${username} not found`
        });
        return;
    }
    res.send({
        message: "Login successful",
        user: isExists,
        token: 'TOKEN'
    });
});
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (token !== 'TOKEN') {
        res.status(403).send({
            message: "Token not provided"
        });
        return;
    }
    next();
}
app.get('/profile/:userId', authMiddleware, (req, res) => {
    const { userId } = req.params;
    const findUser = db_1.users;
});
app.listen(3000, () => {
    console.log("Server runing");
});
