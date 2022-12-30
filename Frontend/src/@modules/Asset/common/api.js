import { defaultModuleApi } from "@apps/utility/moduleApi"
import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"
export const AssetApi = {
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
  async getChannelInfo(url) {
    return await axiosApi.get("youtube/channel-info?url=" + url)
  },
  async detailChannel(filters = {}) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(filters))
    )
    return await axiosApi.get("youtube/detail-channel?" + stringFilters)
  },
  async detailBase(filters = {}) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(filters))
    )
    return await axiosApi.get("youtube/detail-base?" + stringFilters)
  },
  async videoChannel(filters = {}) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(filters))
    )
    return await axiosApi.get("youtube/video-channel?" + stringFilters)
  },
  async videoBase(filters = {}) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(filters))
    )
    return await axiosApi.get("youtube/video-base?" + stringFilters)
  },

  async syncChannel(id) {
    return await axiosApi.get("youtube/sync-channel/" + id)
  },
  async loadBoard(id) {
    return await axiosApi.get("youtube/load-board/" + id)
  },
  async addChannel(data) {
    return await axiosApi.post(
      "youtube/add-channel",
      serialize(_.cloneDeep({ data }))
    )
  },
  async deleteChannel(data) {
    return await axiosApi.post(
      "youtube/delete-channel",
      serialize(_.cloneDeep({ data }))
    )
  },
  async addBase(data) {
    return await axiosApi.post(
      "youtube/add-base",
      serialize(_.cloneDeep({ data }))
    )
  },
  async shareBase(data) {
    return await axiosApi.post(
      "youtube/share-base",
      serialize(_.cloneDeep({ data }))
    )
  },
  async checkBase(data) {
    return await axiosApi.post(
      "youtube/check-base",
      serialize(_.cloneDeep({ data }))
    )
  },
  async changeRPM(data) {
    return await axiosApi.post(
      "youtube/change-rpm",
      serialize(_.cloneDeep({ data }))
    )
  }
}
