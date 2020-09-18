import { Request, Response} from "express"
import { FollowsDatabase } from "../data/FollowsDatabase"
import { Authenticator } from "../services/Authenticator"
import { BaseDatabase } from "../data/BaseDatabase"

export const Unfollow = async (req: Request, res: Response) => {
    try {
        const token: string = req.headers.authorization as string
        const userToUnfollowId: string = req.body.userToUnfollowId as string

        if(!userToUnfollowId || !token) {
            throw new Error("Insert all required information")
        }

        const authenticator = new Authenticator()
        const authenticationData = authenticator.getData(token)
        
        const followsDatabase = new FollowsDatabase()
        await followsDatabase.unfollow(userToUnfollowId, authenticationData.id)

        res.status(200).send({message: "Unfollowed successfully"})
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally {
        await BaseDatabase.destroyConnection()
    }
}