import { axiosApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"
import _ from "lodash"

export const permissionApi = {
  async getList(searchVal = "") {
    return await axiosApi.get(
      "/settings/groups/load" + (searchVal ? "?search=" + searchVal : "")
    )
  },
  async getDetail(id) {
    return await axiosApi.get("/settings/groups/detail/" + id)
  },
  async getPermissions() {
    return await axiosApi.get("/settings/groups/permissions")
  },
  async postValidate(data) {
    return await axiosApi.post("/settings/groups/validate", data)
  },
  async postSave(data) {
    return await axiosApi.post(
      "/settings/groups/save",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async delete(id) {
    return await axiosApi.delete("/settings/groups/delete/" + id)
  },
  async duplicate(id) {
    return await axiosApi.get("/settings/groups/duplicate/" + id)
  }
}

export const permissionApiEdit = {
  async getDetail(id) {
    return await axiosApi.get("/permissions/get-detail/" + id)
  },

  async postSave(data) {
    return await axiosApi.post(
      "/permissions/save",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  }
}
