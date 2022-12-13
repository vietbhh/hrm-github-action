import SwAlert from "@apps/utility/SwAlert"
import useJwt from "@src/auth/jwt/useJwt"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateOnlineUsers } from "redux/app/users"
import socketio from "socket.io-client"

const SocketContext = React.createContext()

export const SocketContextWrap = (props) => {
  const socket = socketio.connect(process.env.REACT_APP_NODE_API_URL, {
    autoConnect: false,
    reconnection: false,
    auth: {
      token:
        !_.isNull(useJwt.getToken()) && !_.isEmpty(useJwt.getToken())
          ? `Bearer ${useJwt.getToken()}`
          : null
    }
  })
  const dispatch = useDispatch()
  const settingSocket =
    useSelector((state) => state.auth.settings.sockets) || false

  useEffect(() => {
    if (!_.isNull(useJwt.getToken()) && !_.isEmpty(useJwt.getToken())) {
      socket.on("connect_error", (err) => {
        console.log("connected")
      })
      socket.on("connect_error", (err) => {
        const refreshToken = useJwt.getRefreshToken()
        const isAlreadyFetchingAccessToken =
          useJwt.getIsAlreadyFetchingAccessToken()
        if (
          err?.data?.type === "UnauthorizedError" &&
          err?.data?.code === "invalid_token" &&
          refreshToken &&
          !isAlreadyFetchingAccessToken
        ) {
          useJwt.setIsAlreadyFetchingAccessToken(true)
          useJwt.refreshToken().then((r) => {
            useJwt.setIsAlreadyFetchingAccessToken(false)
            // ** Update accessToken in localStorage
            useJwt.setToken(r.data.accessToken)
            useJwt.setRefreshToken(r.data.refreshToken)
            useJwt.onAccessTokenFetched(r.data.accessToken)
            socket.connect()
          })
        } else {
          SwAlert.showError({
            title: "Unable connect to socket server",
            text: "Try reloading the page, if the problem persists please contact technical support for assistance",
            iconHtml: <i className="fa-duotone fa-plug-circle-exclamation"></i>,
            showConfirmButton: false,
            allowOutsideClick: false
          })
        }
      })
      socket.on("disconnect", (err) => {
        SwAlert.showError({
          title: "Socket server is disconnected",
          text: "Try reloading the page, if the problem persists please contact technical support for assistance",
          iconHtml: <i className="fa-duotone fa-plug-circle-exclamation"></i>,
          showConfirmButton: false,
          allowOutsideClick: false
        })
      })
      socket.on("users_online", (data) => {
        dispatch(updateOnlineUsers(data))
      })
      if (settingSocket) {
        socket.connect()
      } else {
        socket.close()
      }
      return () => {
        socket.off("connect_error")
        socket.off("disconnect")
      }
    }
  }, [settingSocket, socket])

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketContext
