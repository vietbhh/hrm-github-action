import { axiosApi } from "@apps/utility/api"
import { serialize, object2QueryString } from "@apps/utility/handleData"

export const driveApi = {
  async getMyFolder() {
    return await axiosApi.get("/drive/get-my-folder")
  },
  async getInitDrive() {
    return await axiosApi.get("/drive/get-init-drive")
  },
  async createDriveFolder(data) {
    return await axiosApi.post(
      "drive/create-drive-folder",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async getDriveFolderDetail(params) {
    const strParams = object2QueryString(params)
    return await axiosApi.get(`drive/get-drive-folder-detail?get${strParams}`)
  },
  async uploadFileDrive(data, config = {}) {
    return await axiosApi.post(
      "drive/upload-file-drive",
      serialize(_.cloneDeep(data)),
      {
        disableLoading: true,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        ...config
      }
    )
  },
  async shareFileAndFolder(data) {
    return await axiosApi.post(
      "/drive/share-file-and-folder",
      serialize(_.cloneDeep(data))
    )
  },
  async getFileAndFolderPermission(param) {
    const strParam = object2QueryString(param)
    return await axiosApi.get(
      `/drive/get-file-and-folder-permission?get${strParam}`
    )
  },
  async updateFavorite(data) {
    return await axiosApi.post(
      `/drive/update-favorite`,
      serialize(_.cloneDeep(data))
    )
  },
  async removeDriveContent(data) {
    return await axiosApi.post(
      `/drive/remove-drive-content`,
      serialize(_.cloneDeep(data))
    )
  }
}
