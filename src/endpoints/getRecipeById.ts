import { BaseDatabase } from "../data/BaseDatabase"
import { Request, Response} from "express"
import { RecipesDatabase } from '../data/RecipesDatabase'
import { Authenticator } from '../services/Authenticator'
import moment from "moment"

moment.locale('pt-br')

export const getRecipeById = async (req: Request, res: Response ) => {
    try {
        const token = req.headers.authorization as string
        const id = req.params.id

        const authenticator = new Authenticator()
        const authenticationData = authenticator.getData(token)

        if(!token || !id || !authenticationData) {
            throw new Error('Please fill in all fields')
        }

        const recipesDatabase = new RecipesDatabase()
        const recipe = await recipesDatabase.getRecipeById(id)

        if(!recipe) {
            throw new Error('Recipe not found')
        }

        res.status(200).send({ 
            id: recipe.id, 
            title: recipe.title, 
            description: recipe.description, 
            createdAt: moment(`${recipe.createdAt}`).format("DD/MM/YYYY")
        })
    } catch(error) {
        res.status(400).send({message: error.message})
    } finally {
        await BaseDatabase.destroyConnection()
    }
}