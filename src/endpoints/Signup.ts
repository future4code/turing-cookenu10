import { Request, Response} from "express"
import { UserDatabase } from "../data/UserDatabase"
import { Authenticator } from "../services/Authenticator"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { BaseDatabase } from "../data/BaseDatabase"

export const signup = async (req: Request, res: Response) => {
    try {
        const userData = {
            name: req.body.name as string,
            email: req.body.email as string,
            password: req.body.password as string
        }

        if(!userData.name || !userData.email || !userData.password) {
            throw new Error("Insert all required information")
        }

        if (userData.password.length < 6) {
            throw new Error("The password must contain at least 6 characters")
        }

        const idgenerator: IdGenerator = new IdGenerator()
        const id: string = idgenerator.generate()

        const hashManager: HashManager = new HashManager()
        const hashPassword = await hashManager.hash(userData.password)
        
        const userDataBase = new UserDatabase()
        await userDataBase.createUser(id, userData.name, userData.email, hashPassword)

        const authenticator = new Authenticator()
        const token = authenticator.generateToken({id})

        res.status(200).send({message: "User created successfully", token})
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally {
        await BaseDatabase.destroyConnection()
    }
}