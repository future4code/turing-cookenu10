import moment from "moment"
import { BaseDatabase } from "./BaseDatabase"

export class RecipesDatabase extends BaseDatabase{
  private static TABLE_NAME = "Cookenu_Recipes"

  public async createRecipe(
    id: string,
    title: string,
    description: string,
    createdAt: string,
    userId: string,
  ): Promise<void> {
    await this.getConnection()
      .insert({
        id,
        title,
        description,
        createdAt,
        user_id: userId
      })
      .into(RecipesDatabase.TABLE_NAME)
  }

  public async getRecipeById(id: string): Promise<any> {
    const result = await this.getConnection()
      .select("*")
      .from(RecipesDatabase.TABLE_NAME)
      .where({ id })

    return result[0]
  }

  public async deleteRecipe(id: string): Promise<any> {
    await this.getConnection()
      .delete()
      .from(RecipesDatabase.TABLE_NAME)
      .where({ id })
  }
} 