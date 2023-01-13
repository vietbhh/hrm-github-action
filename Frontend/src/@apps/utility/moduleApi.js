import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"
import { isEmpty } from "lodash"
export const defaultModuleApi = {
  async get(url, opt) {
    return await axiosApi.get(url, opt)
  },
  async post(url, data, opt) {
    return await axiosApi.post(url, serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      ...opt
    })
  },
  async getModuleMeta(m) {
    return await axiosApi.get("/app/module/" + m)
  },
  async getLinkedModule(m) {
    return await axiosApi.get("/module/" + m + "/linked")
  },

  async postSave(m, data, fastUpdate = false, url = "") {
    const pathUrl = isEmpty(url)
      ? "/module/" + m + (fastUpdate ? "?fastUpdate=true" : "")
      : url
    return await axiosApi.post(pathUrl, serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },
  async postImport(m, data) {
    return await axiosApi.post(
      "/module/" + m + "/import",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async exportTemplate(module) {
    return await axiosApi.get(`/module/${module}/export-template`, {
      responseType: "blob"
    })
  },
  async getMappingFields(module, data) {
    return await axiosApi.post(
      `/module/${module}/get-mapping-fields`,
      serialize(_.cloneDeep(data))
    )
  },
  async getImportData(module, data) {
    return await axiosApi.post(
      `/module/${module}/get-import-data`,
      serialize(_.cloneDeep(data))
    )
  },
  async postValidate(m, data, url = "") {
    const pathUrl = isEmpty(url) ? "/module/" + m + "/validate" : url
    return await axiosApi.post(pathUrl, serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },
  async getUsers(props = {}, url = "") {
    const sendProps = {
      page: 1,
      isLoadOption: false,
      optionImgKey: "avatar",
      perPage: null,
      search: "",
      filters: {},
      exceptSelf: false,
      excepts: [],
      rankType: "subordinate", //subordinate | superior | other | subordinate-superior | subordinate-other | superior-other
      rankTarget: [],
      rankDirectOnly: false,
      isPaginate: true,
      withModules: "",
      ...props
    }
    const {
      isLoadOption,
      perPage,
      search,
      page,
      optionImgKey,
      filters,
      exceptSelf,
      excepts,
      rankType,
      rankTarget,
      rankDirectOnly,
      isPaginate,
      withModules
    } = sendProps
    const stringFilters = object2QueryString({ filters: filters })
    const stringExcepts = object2QueryString({ excepts: excepts })
    const stringRankTarget = object2QueryString({
      rankTarget: rankTarget
    })
    const pathUrl = isEmpty(url) ? "/general/users?load" : url
    return await axiosApi.get(
      pathUrl +
        (page ? "&page=" + page : "") +
        (perPage ? "&perPage=" + perPage : "") +
        (search ? "&search=" + search : "") +
        (isLoadOption ? "&isLoadOptions=" + isLoadOption : "") +
        (optionImgKey ? "&optionImgKey=" + optionImgKey : "") +
        (exceptSelf ? "&exceptSelf=" + exceptSelf : "") +
        (!isPaginate ? "&isPaginate=false" : "") +
        (rankType ? "&rankType=" + rankType : "") +
        (rankDirectOnly ? "&rankDirectOnly=" + rankDirectOnly : "") +
        (rankTarget ? stringRankTarget : "") +
        (filters ? stringFilters : "") +
        (excepts ? stringExcepts : "") +
        (withModules ? "&withModules=" + withModules : "")
    )
  },
  async getList(m, props = {}, url = "") {
    const defaultProps = {
      isPaginate: true,
      page: 1,
      isLoadOption: false,
      perPage: null,
      search: "",
      filters: {},
      tableFilters: {},
      orderCol: "id",
      orderType: "DESC",
      optionImgKey: null
    }
    const sendProps = { ...defaultProps, ...props }
    const {
      isLoadOption,
      perPage,
      search,
      filters,
      tableFilters,
      isPaginate,
      page,
      orderCol,
      orderType,
      optionImgKey
    } = sendProps
    const stringFilters = object2QueryString({
      filters: erpSelectToValues(_.cloneDeep(filters))
    })
    const stringTableFilters = object2QueryString({
      tableFilters: erpSelectToValues(_.cloneDeep(tableFilters))
    })
    const pathUrl = isEmpty(url) ? "/module/" + m : url
    return await axiosApi.get(
      pathUrl +
        "?load" +
        (page ? "&page=" + page : "") +
        (orderCol ? "&orderCol=" + orderCol : "") +
        (orderType ? "&orderType=" + orderType : "") +
        (isLoadOption ? "&isLoadOptions=" + isLoadOption : "") +
        (perPage ? "&perPage=" + perPage : "") +
        (search ? "&search=" + search : "") +
        (optionImgKey ? "&optionImgKey=" + optionImgKey : "") +
        (!isPaginate ? "&isPaginate=false" : "") +
        (filters ? stringFilters : "") +
        (tableFilters ? stringTableFilters : "") +
        (sendProps.export ? "&export=true" : "")
    )
  },
  async getFirst(m, props = {}) {
    const url = "/module/" + m + "/first"
    return await this.getList(m, props, url)
  },
  async getLast(m, props = {}) {
    const url = "/module/" + m + "/last"
    return await this.getList(m, props, url)
  },
  async getDetail(m, id, url = "") {
    const pathUrl = isEmpty(url) ? "/module/" + m + "/" + id : url + "/" + id
    return await axiosApi.get(pathUrl)
  },
  async putUpdate(m, data, id) {
    return new Promise((resolve, reject) => {
      resolve(
        axiosApi.put("/module/" + m + "/" + id, data, {
          headers: {
            "Content-Type": "application/json"
          }
        })
      )
    })
  },
  async delete(m, arrId, url = "") {
    const pathUrl = isEmpty(url) ? "/module/" + m : url
    return await axiosApi.delete(pathUrl + "/" + arrId)
  },
  async updateUserMetas(m, data) {
    return await axiosApi.post(
      "/module/" + m + "/user-metas",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async updateModuleSetting(m, data) {
    return await axiosApi.post(
      "/module/" + m + "/setting",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async getLinkContent(data) {
    return await axiosApi.get(
      `link-preview/get-link-content?link=${data.link}`
    )
  }
}
