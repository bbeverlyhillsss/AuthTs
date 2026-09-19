import { UserDocument } from '../models/user.mode.js'
import { SharedUser } from '../types/auth.types.js'

export default class UserDto implements SharedUser {
  public readonly id: string
  public readonly name: string
  public readonly email: string

  constructor(user: UserDocument) {
    this.id = user._id.toString()
    this.name = user.name
    this.email = user.email
  }
}