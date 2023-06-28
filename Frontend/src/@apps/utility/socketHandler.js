import useJwt from "@src/auth/jwt/useJwt"
import socketio from "socket.io-client"

export const socketConnect = ({ path = "" }) => {
  return socketio.connect(import.meta.env.VITE_APP_NODE_API_URL + path, {
    autoConnect: false,
    reconnection: false,
    auth: {
      token:
        !_.isNull(useJwt.getToken()) && !_.isEmpty(useJwt.getToken())
          ? `Bearer ${useJwt.getToken()}`
          : null
    }
  })
}
