import mongoose, { Schema, model, Types, HydratedDocument } from "mongoose";

export interface IToken {
  user: Types.ObjectId;
  refreshToken: string;
}

export type TokenDocument = HydratedDocument<IToken>;

const TokenSchema = new Schema<IToken>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

const Token = model<IToken>("Token", TokenSchema);

export default Token;
