import jwt from "jsonwebtoken"
import { UnauthorizedError } from "./UnauthorizedError.js"
export const authorize = (options) => {
  const { secret, algorithms = ["HS256"], onAuthentication } = options
  return async (socket, next) => {
    let encodedToken = null
    const { token } = socket.handshake.auth
    if (token != null) {
      const tokenSplitted = token.split(" ")
      if (tokenSplitted.length !== 2 || tokenSplitted[0] !== "Bearer") {
        return next(
          new UnauthorizedError("credentials_bad_format", {
            message: "Format is Authorization: Bearer [token]"
          })
        )
      }
      encodedToken = tokenSplitted[1]
    }
    if (encodedToken == null) {
      return next(
        new UnauthorizedError("credentials_required", {
          message: "no token provided"
        })
      )
    }
    socket.encodedToken = encodedToken
    let keySecret = null
    let decodedToken
    if (typeof secret === "string") {
      keySecret = secret
    } else {
      const completeDecodedToken = jwt.decode(encodedToken, { complete: true })
      keySecret = await secret(completeDecodedToken)
    }
    try {
      decodedToken = jwt.verify(encodedToken, keySecret, { algorithms })
    } catch (_a) {
      return next(
        new UnauthorizedError("invalid_token", {
          message: "Unauthorized: Token is missing or invalid Bearer"
        })
      )
    }
    socket.decodedToken = decodedToken
    if (onAuthentication != null) {
      try {
        socket.user = await onAuthentication(decodedToken)
      } catch (error) {
        return next(error)
      }
    }
    return next()
  }
}
