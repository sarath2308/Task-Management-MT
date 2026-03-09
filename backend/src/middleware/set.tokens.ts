import { Response } from "express";

export const setTokens = (
  res: Response,
  accessToken: string,
  refreshToken?: string,
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite:"none",
    maxAge: 15 * 60 * 1000,
  });

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });
  }
};
