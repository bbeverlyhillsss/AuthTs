import jwt from "jsonwebtoken";
import Token from "../models/token.model.js";
import { env } from "../config/config.js";
import { JwtPayload } from "../types/jwt.types.js";

interface Token {
  accessToken: string;
  refreshToken: string;
}

// GENERATE TOKEN
export const generateTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
  return {
    accessToken,
    refreshToken,
  };
};

// VALIDATE TOKENS
export const validateAccessToken = (token: string): JwtPayload | null => {
  try {
    const userData = jwt.verify(token, env.JWT_ACCESS_SECRET);
    return userData as JwtPayload;
  } catch {
    return null;
  }
};

export const validateRefreshToken = (token: string): JwtPayload | null => {
  try {
    const userData = jwt.verify(token, env.JWT_REFRESH_SECRET);
    return userData as JwtPayload;
  } catch {
    return null;
  }
};

// FUNCTIONS WITH TOKEN

export const saveToken = async (userId: string, refreshToken: string) => {
  const tokenData = await Token.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const token = await Token.create({ user: userId, refreshToken });
  return token;
};

export const removeToken = async (refreshToken: string) => {
  const tokenData = await Token.deleteOne({ refreshToken });
  return tokenData;
};

export const findToken = async (refreshToken: string) => {
  const tokenData = await Token.findOne({ refreshToken });
  return tokenData;
};
