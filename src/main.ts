import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { User, users } from './db'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


app.post('/registration', (req, res) => {
    const { username, password } = req.body

    if( !username || !password || username === "" || password === ""){
        res.status(400).send({
            message: "Username & Password is required"
        })
        return
    }

    const isExists = users.find((user) => {
        if(user.username === username){
            return user
        }
    })

    if(isExists){
        res.status(400).send({
            message: `${username} уже создан!!!`
        })
    }

    const newUser: User = {
        id: Date.now(),
        password,
        username
    }

    users.push(newUser)

    res.send({
        message: "User Created",
        users: newUser
    })
})

app.post('/login', (req, res) => {
    const { username, password } = req.body

    const isExists = users.find((user) => user.username === username)

    if( !isExists ) {
        res.status(401).send({
            message: `${username} not found`
        })
        return
    }

    if(!isExists?.password !== password){
        res.status(401).send({
            message: `${username} not found`
        })
        return
    }

    res.send({
        message: "Login successful",
        user: isExists,
        token: 'TOKEN'
    })
})




function authMiddleware (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization

    if( token !== 'TOKEN' ){
        res.status(403).send({
            message: "Token not provided"
        })
        return
    }

    next()
}


app.get('/profile/:userId',authMiddleware, ( req, res) => {
    const {userId} = req.params
    const findUser = users
})



app.listen(3000, () => {
    console.log("Server runing");
})