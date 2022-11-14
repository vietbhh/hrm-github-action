import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import _ from "lodash"

export const appSettingApi = {
  postUpdate(data) {
    return new Promise((resolve, reject) => {
      resolve(
        axiosApi.post("/settings/app", serialize(_.cloneDeep(data)), {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      )
    })
  },
  get() {
    return axiosApi.get("/settings/app")
  }
}

export const generalApi = {
  postUpdate(data) {
    return new Promise((resolve, reject) => {
      resolve(
        axiosApi.post("/settings/general", data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      )
    })
  },
  get() {
    return axiosApi.get("/settings/general")
  }
}

export const usersApi = {
  async getList(params) {
    return await defaultModuleApi.getList(
      "users",
      params,
      "/settings/users/load"
    )
  },
  async getDetail(id) {
    return await axiosApi.get("/settings/users/detail/" + id)
  },
  async postValidate(data) {
    return await axiosApi.post("/settings/users/validate", data)
  },
  async postSave(data) {
    return await axiosApi.post(
      "/settings/users/save",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async getAction(userId, action = "activate") {
    return await axiosApi.get("/settings/users/" + userId + "/" + action)
  },
  async sendInvite(userId) {
    return await axiosApi.get("/settings/users/invite/" + userId)
  },
  async postChangePwd(userId, password) {
    return await axiosApi.post(
      "/settings/users/change-pwd/" + userId,
      serialize(
        _.cloneDeep({
          password: password
        })
      ),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async delete(id) {
    return await axiosApi.delete("/settings/users/delete/" + id)
  },
  async saveDeviceToken(data) {
    return await axiosApi.post(
      "/user/save-device-token",
      serialize(_.cloneDeep(data))
    )
  }
}

export const permitApi = {
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

export const moduleManagerApi = {
  async getModuleMeta(m) {
    return await axiosApi.get("/app/modules/" + m)
  },
  async moduleExists(type = "name", value, except = "") {
    const data = new FormData()
    data.append("type", type)
    data.append("value", value)
    data.append("except", except)
    return await axiosApi.post("/settings/modules/exist", data)
  },
  async postAdd(data) {
    return await axiosApi.post(
      "/settings/modules/add",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async delete(arrId, permanent = "true") {
    return await axiosApi.delete("/settings/modules/delete/" + permanent, {
      data: arrId
    })
  },
  getList() {
    return new Promise((resolve, reject) => {
      resolve(axiosApi.get("/settings/modules"))
    })
  },
  getDetail(name) {
    return new Promise((resolve, reject) => {
      resolve(axiosApi.get("/settings/modules/" + name))
    })
  },
  putUpdate(data, id) {
    return new Promise((resolve, reject) => {
      resolve(
        axiosApi.put(
          "/settings/modules/" + id,
          erpSelectToValues(_.cloneDeep(data)),
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
      )
    })
  }
}
