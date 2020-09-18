import { Request, Response} from "express"
import { BaseDatabase } from "../data/BaseDatabase"
import moment from "moment"
import { RecipesDatabase } from "../data/RecipesDatabase"
import { Authenticator } from "../services/Authenticator"
import { IdGenerator } from "../services/IdGenerator"

export const CreateRecipe = async (req: Request, res: Response) => {
    try {
            const token: string = req.headers.authorization as string
            const title: string = req.body.title as string
            const description: string = req.body.description as string

        if(!title || !description) {
            throw new Error("Insert all required information")
        }

        const idgenerator: IdGenerator = new IdGenerator()
        const id: string = idgenerator.generate()

        const createdAt: string = moment().format("YYYY-MM-DD")

        const authenticator = new Authenticator()
        const authenticationData = authenticator.getData(token)
        
        const userDataBase = new RecipesDatabase()
        await userDataBase.createRecipe(id, title, description, createdAt, authenticationData.id)

        res.status(200).send({message: "Recipe created successfully"})
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally {
        await BaseDatabase.destroyConnection()
    }
}