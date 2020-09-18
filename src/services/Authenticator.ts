import * as jwt from "jsonwebtoken"

export class Authenticator {
  public generateToken(input: AuthenticationData): string {
    const token = jwt.sign(
      {
        id: input.id
      },
      process.env.JWT_KEY as string,
      {
        expiresIn: process.env.EXPIRES_IN as string,
      }
    )
    return token
  }

  public decodeToken(token: string) : any {
    const decoded = jwt.decode(token)

    return decoded
  }

  public getData(token: string): AuthenticationData {
    const payload = jwt.verify(token, process.env.JWT_KEY as string) as any
    const result = {
      id: payload.id,
      role: payload.role
    }
    return result
  }
}

interface AuthenticationData {
  id: string
}