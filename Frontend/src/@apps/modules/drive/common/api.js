import { axiosApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"

export const driveApi = {
  async getMyDriveFolder() {
    return await axiosApi.get("/drive/get-my-drive-folder")
  }
}
