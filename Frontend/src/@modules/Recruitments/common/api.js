import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const candidatesApi = {
  async getInfo(id) {
    return await axiosApi.get("/recruitments/candidate-info/" + id)
  },
  async exportData(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/recruitments/export-candidates?" + stringFilters,
      {
        responseType: "blob"
      }
    )
  }
}
export const recruitmentsApi = {
  async saveRequest(data) {
    return await axiosApi.post(
      "/recruitments/add",
      serialize(_.cloneDeep({ data }))
    )
  },
  async getData(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/recruitments/load?" + stringFilters)
  },
  async getJob(id, search = "") {
    return await axiosApi.get("/recruitments/job/" + id, {
      params: {
        search: search
      }
    })
  },
  async changeStatus(id, status) {
    return await axiosApi.get(`/recruitments/change-status/${id}/${status}`)
  },
  async changeStage(recruitmentId, data) {
    return await axiosApi.post(
      `/recruitments/change-stage/${recruitmentId}`,
      serialize(_.cloneDeep(data))
    )
  },
  async getJobsData(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/recruitments/load-job?" + stringFilters)
  },
  async getApproveData(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/recruitments/load-approve?" + stringFilters)
  },
  async checkCandidateInterviewSchedule(recruitmentId, candidateId) {
    return await axiosApi.get(
      `/recruitments/check-candidate-interview-schedule/${recruitmentId}/${candidateId}`
    )
  },
  async getInfo(id) {
    return await axiosApi.get("/recruitments/info/" + id)
  },
  async saveApprove(recruitmentId, data = {}) {
    return await axiosApi.post(
      `/recruitments/approve/${recruitmentId}`,
      serialize(_.cloneDeep({ data }))
    )
  },
  async getActivity(recruitmentId, page = 1) {
    return await axiosApi.get(`/recruitments/activity/${recruitmentId}`, {
      params: {
        page
      }
    })
  },
  async loadCV(data = {}) {
    return await axiosApi.post(
      `/recruitments/load-cv`,
      serialize(_.cloneDeep({ data }))
    )
  },
  async saveCandidate(data = {}) {
    return await axiosApi.post(
      `/recruitments/add-candidate`,
      serialize(_.cloneDeep({ data }))
    )
  },
  async loadCandidate(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(`/recruitments/load-candidate?` + stringFilters)
  },
  async loadContentCV(data) {
    return await axiosApi.post(
      "recruitments/load-content-cv",
      serialize(_.cloneDeep(data))
    )
  },
  async loadEmployeeEmail(idJob) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep({ idJob: idJob }))
    )
    return await axiosApi.get(
      "recruitments/load-employee-email?" + stringFilters
    )
  },
  async deleteListFileCV(data) {
    return await axiosApi.post(
      "recruitments/delete-list-file-cv",
      serialize(_.cloneDeep(data))
    )
  },
  async importCV(data) {
    return await axiosApi.post(
      "recruitments/import-cv",
      serialize(_.cloneDeep(data))
    )
  },
  async deleteOldCV() {
    return await axiosApi.post("recruitments/delete-old-cv")
  },

  async checkExistJob(data) {
    return await axiosApi.post(
      "recruitments/check-exist-job",
      serialize(_.cloneDeep(data))
    )
  },
  async getTagSource() {
    return await axiosApi.get("recruitments/tags-sources")
  },
  async saveEmailTemplate(data) {
    return await axiosApi.post(
      "recruitments/email-template",
      serialize(_.cloneDeep(data))
    )
  },
  async loadEmailTemplate() {
    return await axiosApi.get("recruitments/load-email-template")
  },
  async deleteEmailTemplate(id) {
    return await axiosApi.post(
      "recruitments/email-template",
      serialize(_.cloneDeep({ delete: id }))
    )
  },
  async saveGeneral(data) {
    return await axiosApi.post(
      "recruitments/save-general",
      serialize(_.cloneDeep({ data }))
    )
  }
}
