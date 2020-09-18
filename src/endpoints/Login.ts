import { BaseDatabase } from "../data/BaseDatabase"
import { Request, Response} from "express"
import { UserDatabase } from "../data/UserDatabase"
import { Authenticator } from "../services/Authenticator"
import { HashManager } from "../services/HashManager"

export const login = async (req: Request, res: Response) => {
    try {
        if (!req.body.email || req.body.email.indexOf("@") === -1) {
          throw new Error("Invalid email")
        }
    
        const userData = {
          email: req.body.email,
          password: req.body.password,
        }
    
        const userDatabase = new UserDatabase()
        const user = await userDatabase.getUserByEmail(userData.email)
    
        const passwordIsCorrect: boolean = await new HashManager().compare(userData.password, user.password)
    
        if (!passwordIsCorrect) {
          throw new Error('email or password invalid')
        }
    
        const authenticator = new Authenticator();
        const token = authenticator.generateToken({
          id: user.id,
        })
    
        res.status(200).send({"access token": token})
      } catch (error) {
        res.status(400).send({message: error.message})
      } finally {
        await BaseDatabase.destroyConnection()
      }
}