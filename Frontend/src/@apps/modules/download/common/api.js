import { axiosApi, axiosNodeApi } from "@apps/utility/api"

export const downloadApi = {
  getPhoto(file) {
    return new Promise((resolve, reject) => {
      resolve(
        axiosApi.get("/download/image?name=" + file, {
          disableLoading: true,
          responseType: "blob"
        })
      )
    })
  },
  getLogo(file, type = "normal") {
    return new Promise((resolve, reject) => {
      resolve(
        axiosApi.get("/download/logo/image?name=" + file + "&type=" + type, {
          disableLoading: true,
          responseType: "blob"
        })
      )
    })
  },
  getPhotoPublic(file) {
    return new Promise((resolve, reject) => {
      resolve(
        axiosApi.get("/download/public/image?name=" + file, {
          disableLoading: true,
          responseType: "blob"
        })
      )
    })
  },
  getAvatar(file) {
    return new Promise((resolve, reject) => {
      resolve(
        axiosApi.get("/download/avatar?name=" + file, {
          disableLoading: true,
          responseType: "blob"
        })
      )
    })
  },
  getAvatarByUserId(userId) {
    return new Promise((resolve, reject) => {
      resolve(
        axiosApi.get("/download/avatar?user=" + userId, {
          disableLoading: true,
          responseType: "blob"
        })
      )
    })
  },
  getFile(file, downloadFromStorage) {
    return new Promise((resolve, reject) => {
      let src = "/download/file?name=" + file
      if (downloadFromStorage === true) {
        src += "&type=cloud_storage"
      }

      resolve(
        axiosApi.get(src, {
          responseType: "arraybuffer"
        })
      )
    })
  }
}
