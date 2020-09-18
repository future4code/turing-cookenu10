import { BaseDatabase } from "../data/BaseDatabase"
import { Request, Response} from "express"
import { FollowsDatabase } from "../data/FollowsDatabase"
import { Authenticator } from "../services/Authenticator"

export const Follow = async (req: Request, res: Response) => {
    try {
            const token: string = req.headers.authorization as string
            const userFollowedId: string = req.body.userToFollowId as string

        if(!userFollowedId || !token) {
            throw new Error("Insert all required information")
        }

        const authenticator = new Authenticator()
        const authenticationData = authenticator.getData(token)

        if(userFollowedId === authenticationData.id) {
            throw new Error("You cannot follow yourself")
        }
        
        const followsDatabase = new FollowsDatabase()
        await followsDatabase.follow(userFollowedId, authenticationData.id)

        res.status(200).send({message: "Followed successfully"})
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally {
        await BaseDatabase.destroyConnection()
    }
}