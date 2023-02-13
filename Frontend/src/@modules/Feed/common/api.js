import { axiosNodeApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const feedApi = {
  async postUploadAttachment(data) {
    return await axiosNodeApi.post(
      "/feed/upload-attachment",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  }
}
