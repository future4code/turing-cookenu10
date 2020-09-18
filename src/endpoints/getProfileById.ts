import { BaseDatabase } from "../data/BaseDatabase"
import { Request, Response} from "express"
import { UserDatabase } from '../data/UserDatabase'
import { Authenticator } from '../services/Authenticator'

export const getProfileById = async (req: Request, res: Response ) => {
    try {
        const token = req.headers.authorization as string
        const id = req.params.id

        const authenticator = new Authenticator()
        const authenticationData = authenticator.getData(token)

        if(!token || !id || !authenticationData) {
            throw new Error('Please fill in all fields')
        }

        const userDatabase = new UserDatabase()
        const user = await userDatabase.getUserById(id)

        if(!user) {
            throw new Error('User not found')
        }

        res.status(200).send({id: user.id, name: user.name, email: user.email})
    } catch(error) {
        res.status(400).send({message: error.message})
    } finally {
        await BaseDatabase.destroyConnection()
    }
}