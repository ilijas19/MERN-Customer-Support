import CustomError from "../errors/error-index.js";
import Token from "../model/Token.js";
import { attachCookiesToResponse, verifyJwt } from "../utils/jwt.js";

export const authorizePermision = (...roles) => {
  return (req, res, next) => {
    if (req.user.role === "admin") return next();
    if (roles.includes(req.user.role)) return next();
    throw new CustomError.UnauthorizedError(
      "Not authorized to access this route"
    );
  };
};

export const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  if (!accessToken && !refreshToken) {
    throw new CustomError.UnauthenticatedError("Authentication Failed");
  }
  if (accessToken) {
    const decoded = verifyJwt(accessToken);
    req.user = decoded.user;
    return next();
  }
  if (refreshToken) {
    const decoded = verifyJwt(refreshToken);
    const token = await Token.findOne({
      user: decoded.user.userId,
      refreshToken: decoded.refreshToken,
    });
    if (!token || !token.isValid) {
      throw new CustomError.UnauthenticatedError("Authetnication Failed");
    }
    req.user = decoded.user;
    attachCookiesToResponse({
      res,
      user: decoded.user,
      refreshToken: decoded.refreshToken,
    });
    return next();
  }
  throw new CustomError.UnauthenticatedError("Authetnication Failed");
};
