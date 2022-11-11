// ** Core JWT Import
import useJwt from "./services/useJwt"

const jwtConfig = {
  loginEndpoint: `${process.env.REACT_APP_API_URL}/auth/login`,
  refreshEndpoint: `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
  logoutEndpoint: `${process.env.REACT_APP_API_URL}/auth/logout`,
  profileEndpoint: `${process.env.REACT_APP_API_URL}/auth/profile`,
  settingEndpoint: `${process.env.REACT_APP_API_URL}/auth/setting`,
  tokenType: "Bearer",
  storageTokenKeyName: "accessToken",
  storageRefreshTokenKeyName: "refreshToken"
}
const { jwt } = useJwt(jwtConfig)

export default jwt
