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
  }
}
