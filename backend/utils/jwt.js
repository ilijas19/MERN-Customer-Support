import jwt from "jsonwebtoken";

const createJwt = ({ payload, expiresIn }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const oneHour = 1000 * 60 * 60;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;

  const accessTokenJwt = createJwt({ payload: { user }, expiresIn: "1h" });
  const refreshTokenJwt = createJwt({
    payload: { user, refreshToken },
    expiresIn: "7d",
  });

  res.cookie("accessToken", accessTokenJwt, {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: oneHour,
    sameSite: "Strict",
    path: "/",
  });

  res.cookie("refreshToken", refreshTokenJwt, {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: oneWeek,
    sameSite: "Strict",
    path: "/",
  });
};
