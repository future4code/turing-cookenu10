import express from "express"
import dotenv from "dotenv"
import { AddressInfo } from "net"
import { signup } from "./endpoints/Signup"
import { login } from "./endpoints/Login"
import { getownprofile } from "./endpoints/getOwnProfile"
import { getProfileById } from "./endpoints/getProfileById"
import { CreateRecipe } from "./endpoints/CreateRecipe"
import { getRecipeById } from "./endpoints/getRecipeById"
import { Follow } from "./endpoints/Follow"
import { Unfollow } from "./endpoints/Unfollow"
import { getFeed } from "./endpoints/getFeed"

dotenv.config()

const app = express()
app.use(express.json())

app.post('/signup', signup)
app.post('/login', login)
app.get('/user/profile', getownprofile)
app.get('/user/:id', getProfileById)
app.post('/recipe', CreateRecipe)
app.get('/recipe/:id', getRecipeById)
app.post('/user/follow', Follow)
app.post('/user/unfollow', Unfollow)
app.get('/users/feed', getFeed)

const server = app.listen(process.env.PORT || 3000, () => {
    if (server) {
      const address = server.address() as AddressInfo
      console.log(`Server is running in http://localhost:${address.port}`)
    } else {
      console.error(`Failure upon starting server.`)
    }
})