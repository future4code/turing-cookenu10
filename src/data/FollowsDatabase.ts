import { BaseDatabase } from "./BaseDatabase"
import knex from "knex"

export class FollowsDatabase extends BaseDatabase{
  private static TABLE_NAME = "Cookenu_Follows"

  public async follow(
    userFollowedId: string,
    userFollowerId: string
  ): Promise<void> {
    await this.getConnection()
      .insert({
        userfollowed_id: userFollowedId,
        userfollower_id: userFollowerId
      })
      .into(FollowsDatabase.TABLE_NAME)
  }

  public async unfollow(
    userToUnfollowId: string,
    userFollowerId: string): Promise<any> {
    await this.getConnection()
    .raw(`
        DELETE FROM Cookenu_Follows
        WHERE userfollowed_id = "${userToUnfollowId}" AND userfollower_id = "${userFollowerId}"
    `)
  }

  public async feed(userFollowerId: string): Promise<any> {
      const result = await this.getConnection()
      .raw(`
        SELECT CR.id, CR.title, CR.description, CR.createdAt, CR.user_id AS userId, CU.name as userName
        FROM Cookenu_Follows CF
        JOIN Cookenu_User CU
        ON CF.userfollowed_id = CU.id
        JOIN Cookenu_Recipes CR
        ON CF.userfollowed_id  = CR.user_id
        WHERE CF.userfollower_id = "${userFollowerId}"
        ORDER BY createdAt DESC;
      `)
      return result[0]
  }
}