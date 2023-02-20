import { axiosNodeApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"

export const feedApi = {
  async postUploadAttachment(data) {
    return await axiosNodeApi.post(
      "/feed/upload-temp-attachment",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getGetAllEmployee() {
    return await axiosNodeApi.get("/feed/get-all-employee")
  },

  async postSubmitPost(data) {
    return await axiosNodeApi.post(
      "/feed/submit-post",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  }
}
