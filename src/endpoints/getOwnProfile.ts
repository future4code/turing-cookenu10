import { BaseDatabase} from "../data/BaseDatabase"
import { Request, Response} from "express"
import { UserDatabase } from "../data/UserDatabase"
import { Authenticator } from "../services/Authenticator"

export const getownprofile = async (req: Request, res: Response) => {
    try {
        const authenticator = new Authenticator()
        const decodeToken = authenticator.decodeToken(req.headers.authorization as string)

        const userDataBase = new UserDatabase()
        const result = await userDataBase.getUserById(decodeToken.id)

        const response = {
            id: result.id, 
            name: result.name, 
            email: result.email
        }
    
        res.status(200).send(response)
      } catch (err) {
        res.status(400).send({message: err.message})
      } finally {
        await BaseDatabase.destroyConnection()
      }   
}