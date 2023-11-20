import { axiosNodeApi } from "@apps/utility/api"

export const stickerApi = {
  async list(search, page, perPage, stickerDefault) {
    const searchQuery = search ? search : ""
    const pageQuery = page ? `&page=${page}` : ""
    const perPageQuery = perPage ? `&perPage=${perPage}` : ""
    const defaultQuery = stickerDefault ? `&default=${stickerDefault}` : ""

    return await axiosNodeApi.get(
      `sticker?search=${searchQuery}${pageQuery}${perPageQuery}${defaultQuery}`
    )
  },
  async uploads(formData, id) {
    return await axiosNodeApi.post("sticker/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      params: {
        id
      }
    })
  },
  async create(data) {
    return await axiosNodeApi.post("sticker/create", data)
  },
  async detail(id) {
    return await axiosNodeApi.get("sticker/" + id)
  },
  async update(data, id) {
    return await axiosNodeApi.put(`sticker/update/${id}`, data)
  },
  async delete(id) {
    return await axiosNodeApi.delete(`sticker/delete/${id}`)
  },
  async updateStatus(id, stickerIconId = null) {
    const paramStickerIcon = stickerIconId ? `?sub_id=${stickerIconId}` : ""
    return await axiosNodeApi.get(
      `sticker/update-status/${id}${paramStickerIcon}`
    )
  }
}
