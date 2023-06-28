// ** Core JWT Import
import useJwt from "./services/useJwt"

const jwtConfig = {
  loginEndpoint: `${import.meta.env.VITE_APP_API_URL}/auth/login`,
  refreshEndpoint: `${import.meta.env.VITE_APP_API_URL}/auth/refresh-token`,
  logoutEndpoint: `${import.meta.env.VITE_APP_API_URL}/auth/logout`,
  profileEndpoint: `${import.meta.env.VITE_APP_API_URL}/auth/profile`,
  settingEndpoint: `${import.meta.env.VITE_APP_API_URL}/auth/setting`,
  tokenType: "Bearer",
  storageTokenKeyName: "accessToken",
  storageRefreshTokenKeyName: "refreshToken"
}
const { jwt } = useJwt(jwtConfig)

export default jwt
