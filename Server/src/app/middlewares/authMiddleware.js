import jwt from "jsonwebtoken"
export const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization")
  if (!authHeader) {
    const error = new Error("invalid_auth_token")
    error.statusCode = 401
    throw error
  }
  const token = authHeader.split(" ")[1]
  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    const newError = new Error("invalid_auth_token")
    newError.statusCode = 401
    throw newError
  }
  if (!decodedToken) {
    const error = new Error("invalid_auth_token")
    error.statusCode = 401
    throw error
  }
  var current_time = Date.now() / 1000
  if (
    typeof decodedToken.exp !== "undefined" &&
    decodedToken.exp < current_time
  ) {
    const error = new Error("invalid_auth_token")
    error.statusCode = 401
    throw error
  }
  req.userId = decodedToken.userId
  next()
}
