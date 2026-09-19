import bcrypt from "bcrypt";
import User from "../models/user.mode.js";
import { RegisterPayload, LoginPayload } from "../types/auth.types.js";
import { AuthResponse } from "../types/auth.types.js";
import ApiError from "../exceptions.ts/api.error.js";
import UserDto from "../dtos/user.dto.js";
import { findToken, generateTokens, removeToken } from "./token.service.js";
import { saveToken, validateRefreshToken } from "./token.service.js";

export const registerService = async ({
  name,
  email,
  password,
}: RegisterPayload): Promise<AuthResponse> => {
  const candidate = await User.findOne({ email });
  if (candidate) {
    throw ApiError.BadRequest(`User with email ${email} already exist.`);
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};

export const loginService = async ({
  email,
  password,
}: LoginPayload): Promise<AuthResponse> => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.BadRequest("User with this email not found.");
  }
  const isPasswordEqual = await bcrypt.compare(password, user.password);
  if (!isPasswordEqual) {
    throw ApiError.BadRequest("Invalid password.");
  }

  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};

export const logoutService = async (refreshToken: string) => {
  const token = await removeToken(refreshToken);
  return token;
};

export const refreshService = async (
  refreshToken: string | undefined,
): Promise<AuthResponse> => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }

  const userData = validateRefreshToken(refreshToken);
  const tokenFromDb = await findToken(refreshToken);

  if (!userData || !tokenFromDb) {
    throw ApiError.UnauthorizedError();
  }

  const user = await User.findById(userData.id);
  if (!user) {
    throw ApiError.UnauthorizedError();
  }

  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};
