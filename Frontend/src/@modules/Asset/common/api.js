import { defaultModuleApi } from "@apps/utility/moduleApi"
import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const assetApi = {
  async getAssetTemplate() {
    return await axiosApi.get("asset-import-asset/get-asset-template", {
      responseType: "blob"
    })
  },
  async getMappingFields(data) {
    return await axiosApi.post(
      "/asset-import-asset/get-mapping-fields",
      serialize(_.cloneDeep(data))
    )
  },
  async getImportData(data) {
    return await axiosApi.post(
      "/asset-import-asset/get-import-data",
      serialize(_.cloneDeep(data))
    )
  },
  async importAsset(data) {
    return await axiosApi.post(
      "/asset-import-asset/import-asset",
      serialize(_.cloneDeep(data))
    )
  },
  async getDataAssetList(params) {
    const strParam = object2QueryString(params)
    return await axiosApi.get(`/asset/get-data-asset-list?get${strParam}`)
  },
  async loadData(filters = {}) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(filters))
    )
    return await axiosApi.get("/asset/load-data?" + stringFilters)
  },

  async loadHistory(filters = {}) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(filters))
    )
    return await axiosApi.get("/asset/load-history?" + stringFilters)
  },

  async detailAsset(id) {
    return await defaultModuleApi.getDetail("asset_lists", id)
  },

  async detailAssetByCode(code) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep({ code }))
    )
    return await axiosApi.get("/asset/detail-by-code?" + stringFilters)
  },

  async updateSTT(data) {
    return await axiosApi.post(
      "/asset/update-status",
      serialize(_.cloneDeep(data))
    )
  },

  async handOver(data) {
    return await axiosApi.post("/asset/hand-over", serialize(_.cloneDeep(data)))
  },
  async postError(data) {
    return await axiosApi.post("/asset/error", serialize(_.cloneDeep(data)))
  },
  async addAsset(data) {
    return await axiosApi.post("/asset/add", serialize(_.cloneDeep(data)))
  },

  // ** asset group api
  async createAssetGroup(data) {
    return await axiosApi.post(
      "asset-groups/create",
      serialize(_.cloneDeep(data))
    )
  },
  async getDataAssetGroup(params) {
    const strParam = object2QueryString(params)
    return await axiosApi.get(
      `asset-groups/get-data-asset-group?get${strParam}`
    )
  },
  async updateAssetGroup(id, data) {
    return await axiosApi.post(
      `asset-groups/update/${id}`,
      serialize(_.cloneDeep(data))
    )
  },
  async deleteAssetGroup(id) {
    return await axiosApi.post(`asset-groups/delete/${id}`)
  },

  // ** asset type api
  async createAssetType(data) {
    return await axiosApi.post(
      "asset-types/create",
      serialize(_.cloneDeep(data))
    )
  },
  async getDataAssetType(params) {
    const strParam = object2QueryString(params)
    return await axiosApi.get(`asset-types/get-data-asset-type?get${strParam}`)
  },
  async updateAssetType(id, data) {
    return await axiosApi.post(
      `asset-types/update/${id}`,
      serialize(_.cloneDeep(data))
    )
  },
  async deleteAssetType(id) {
    return await axiosApi.post(`asset-types/delete/${id}`)
  }
}
