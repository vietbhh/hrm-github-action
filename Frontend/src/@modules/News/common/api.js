import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const newsApi = {
  async getList(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/news/load-news?" + stringFilters, {
      disableLoading: true
    })
  },

  async getNewsDetail(params) {
    return await axiosApi.get("/news/get-news-detail/" + params)
  },

  async deleteNews(params) {
    return await axiosApi.get("/news/delete-news/" + params)
  },

  async postSave(data) {
    return await axiosApi.post("/news/add-news", serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },

  async getEmployeesByDepartment(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/news/get-employees-by-department?" + stringFilters
    )
  },

  async uploadImg(data) {
    return await axiosApi.post(
      "/news/upload-image",
      serialize(_.cloneDeep({ data }))
    )
  },

  async postSaveComment(data) {
    return await axiosApi.post(
      "/news/save-comment",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getLoadMoreComments(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/news/load-more-comments?" + stringFilters)
  },

  async editNewComment(data) {
    return await axiosApi.post(
      "/news/edit-comment",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async deleteNewComment(params) {
    return await axiosApi.get("/news/delete-comment/" + params)
  }
}
