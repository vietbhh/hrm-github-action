import { defaultModuleApi } from "@apps/utility/moduleApi"
import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const assetApi = {
  async getAssetTemplate() {
    return await axiosApi.get("asset/get-asset-template", {
      responseType: "blob"
    })
  },
  async getMappingFields(data) {
    return await axiosApi.post(
      "/asset/get-mapping-fields",
      serialize(_.cloneDeep(data))
    )
  },
  async getImportData(data) {
    return await axiosApi.post(
      "/asset/get-import-data",
      serialize(_.cloneDeep(data))
    )
  },
  async importAsset(data) {
    return await axiosApi.post(
      "/asset/import-asset",
      serialize(_.cloneDeep(data))
    )
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
  }
}

export const assetInventoryApi = {
  async postAddInventory(data) {
    return await axiosApi.post(
      "/asset-inventories/add-new-inventory",
      serialize(_.cloneDeep(data))
    )
  },

  async getListInventory(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/asset-inventories/get-list-inventory?" + stringFilters
    )
  },

  async getInventory(id) {
    return await axiosApi.get("/asset-inventories/get-inventory/" + id)
  },

  async getListInventoryDetail(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/asset-inventories/get-list-inventory-detail?" + stringFilters
    )
  },

  async getAssetDetail(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/asset-inventories/get-asset-detail?" + stringFilters
    )
  },

  async postSaveInventoryDetail(params) {
    return await axiosApi.post(
      "/asset-inventories/save-inventory-detail",
      serialize(_.cloneDeep(params)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  }
}
