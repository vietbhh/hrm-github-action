import { axiosApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"

export const DocumentApi = {
  async getDocument(params) {
    return await axiosApi.get(
      "documents/document",
      serialize(_.cloneDeep(params))
    )
  },
  async postSaveDocument(data) {
    return await axiosApi.post(
      "documents/save-document",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async postEditDocument(id, data) {
    return await axiosApi.post(
      `documents/update-document/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async postDeleteDocument(id) {
    const pathUrl = `/documents/remove-document/${id}`
    return await axiosApi.delete(pathUrl)
  },
  async postDownloadDocument(id) {
    return await axiosApi.get(`documents/download-document/${id}`, {
      responseType: "arraybuffer"
    })
  },
  async postShareDocument(id, data) {
    return await axiosApi.post(
      `documents/share-document/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async postUpdateDocumentShareStatus(id, data) {
    return await axiosApi.post(
      `documents/update-share-status/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async getDocumentDetail(id, params) {
    let queryString = ""
    if (params.hasOwnProperty("filename")) {
      queryString = `?filename=${params.filename}`
    }
    return await axiosApi.get(`documents/document-detail/${id}${queryString}`)
  },
  async uploadFileDocument(id, params) {
    return await axiosApi.post(
      `documents/upload-file-document/${id}`,
      serialize(_.cloneDeep(params)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async replaceFile(id, params) {
    return await axiosApi.post(
      `documents/replace-file-document/${id}`,
      serialize(_.cloneDeep(params)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async deleteFile(id, params) {
    return await axiosApi.post(
      `documents/delete-file-document/${id}`,
      serialize(_.cloneDeep(params)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async uploadFileFromGoogleDrive(id, data) {
    return await axiosApi.post(
      `documents/upload-file-from-google-drive/${id}`,
      serialize(_.cloneDeep(data))
    )
  },
  async getInfoDocument(id) {
    return await axiosApi.get(`documents/get-info-document/${id}`)
  }
}
