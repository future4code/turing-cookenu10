import moment from "moment"
import { BaseDatabase } from "../data/BaseDatabase"
import { Request, Response} from "express"
import { FollowsDatabase } from '../data/FollowsDatabase'
import { Authenticator } from '../services/Authenticator'

export const getFeed = async (req: Request, res: Response ) => {
    try {
        const token = req.headers.authorization as string

        const authenticator = new Authenticator()
        const authenticationData = authenticator.getData(token)

        if(!authenticationData) {
            throw new Error('Please fill in all fields')
        }

        const followDatabase = new FollowsDatabase()
        const result = await followDatabase.feed(authenticationData.id)

        if(!result) {
            throw new Error('Feed not found')
        }

        let recipes: Post[] = []

        result.forEach((post: any) => {
            const postfeed: Post = new Post(post.id, post.title, post.description, post.createdAt, post.userId, post.userName)
            recipes.push(postfeed)
        })

        res.status(200).send({"recipes": recipes})
    } catch(error) {
        res.status(400).send({message: error.message})
    } finally {
        await BaseDatabase.destroyConnection()
    }
}

class Post {
    id: string
    title: string
    description: string
    createdAt: string
    userId: string
    userName: string

    constructor(
        id: string, 
        title: string, 
        description: string,
        createdAt: moment.Moment, 
        userId: string,
        userName: string
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.createdAt = moment(createdAt).format("DD/MM/YYYY")
        this.userId = userId
        this.userName = userName
    }
}    