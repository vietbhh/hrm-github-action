import useJwt from "@src/auth/jwt/useJwt"
import axios from "axios"
import { isEmpty, isUndefined } from "lodash-es"

class API {
  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false
  // ** For Refreshing Token
  subscribers = []
  constructor({ url, onErrors }) {
    const jwtConfig = useJwt.jwtConfig
    this.instance = axios.create({
      baseURL: url
    })
    this.headers = {}
    //this.addToken();

    // ** Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        if (
          isUndefined(config.disableLoading) &&
          !isEmpty(global.appLoadingBar)
        ) {
          global.appLoadingBar.continuousStart()
        }
        // ** Get token from localStorage
        const accessToken = useJwt.getToken()

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // ** Add request/response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        if (
          isUndefined(response.config.disableLoading) &&
          !isEmpty(global.appLoadingBar)
        ) {
          global.appLoadingBar.complete()
        }
        return response
      },
      (error) => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config
        const refreshToken = useJwt.getRefreshToken()
        // ** if (status === 401) {
        if (refreshToken) {
          if (
            response &&
            response.status === 401 &&
            response.data.messages.error !== "wrong_credentials"
          ) {
            if (!this.isAlreadyFetchingAccessToken && refreshToken) {
              this.isAlreadyFetchingAccessToken = true
              useJwt.refreshToken().then((r) => {
                this.isAlreadyFetchingAccessToken = false

                // ** Update accessToken in localStorage
                useJwt.setToken(r.data.accessToken)
                useJwt.setRefreshToken(r.data.refreshToken)
                useJwt.onAccessTokenFetched(r.data.accessToken)
              })
            }
            const retryOriginalRequest = new Promise((resolve) => {
              useJwt.addSubscriber((accessToken) => {
                // ** Make sure to assign accessToken according to your response.
                // ** Check: https://pixinvent.ticksy.com/ticket/2413870
                // ** Change Authorization header
                originalRequest.headers.Authorization = `${jwtConfig.tokenType} ${accessToken}`
                resolve(this.instance(originalRequest))
              })
            })
            return retryOriginalRequest
          }
        }

        if (
          isUndefined(config.disableLoading) &&
          !isEmpty(global.appLoadingBar)
        ) {
          global.appLoadingBar.complete()
        }
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.request.use((request) => {
      Object.keys(this.headers).map((key) => {
        const val =
          typeof this.headers[key] === "function"
            ? this.headers[key]()
            : this.headers[key]
        if (val) {
          request.headers[key] = val
        }
        return key
      })
      return request
    })
  }
  addHeader = (key, getHeader) => {
    this.headers[key] = getHeader
  }

  get = (url, config = null) => {
    return this.instance.get(url, config)
  }

  delete = (url, config = null) => {
    return this.instance.delete(url, config)
  }

  post = (url, data, config) => {
    return this.instance.post(url, data, config)
  }

  put = (url, data, config) => {
    return this.instance.put(url, data, config)
  }
}

export const axiosApi = new API({
  url: process.env.REACT_APP_API_URL,
  onErrors: {
    invalid_auth_token: () => {
      localStorage.clear()
    },
    other: (resError) => {
      console(resError)
    }
  }
})
