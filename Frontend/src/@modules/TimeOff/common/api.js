import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const timeoffApi = {
  async getMytimeOffConfig() {
    return await axiosApi.get("/time-off/get-mytime-off-config")
  },

  async getDurationAllow(type) {
    return await axiosApi.get("/time-off/get-duration-allow/" + type)
  },

  async postSaveRequest(data) {
    return await axiosApi.post(
      "/time-off/submit-request",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getBalance() {
    return await axiosApi.get("/time-off/get-balance")
  },

  async getMyRequests(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/time-off/get-my-requests?" + stringFilters)
  },

  async getDeleteFile(id) {
    return await axiosApi.get("/time-off/delete-file/" + id)
  },

  async getDeleteApprover(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/time-off/get-delete-approver?" + stringFilters)
  },

  async getAddApprover(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/time-off/get-add-approver?" + stringFilters)
  },

  async postChangeFile(data) {
    return await axiosApi.post(
      "/time-off/change-file",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getBalanceHistory(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/time-off/get-balance-history?" + stringFilters)
  },

  async getCancel(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/time-off/get-cancel?" + stringFilters)
  },

  async getApproveRequest(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/time-off/get-approve?" + stringFilters)
  },

  async getRejectRequest(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/time-off/get-reject?" + stringFilters)
  },

  async getMailRequest(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/time-off/get-mail-request?" + stringFilters)
  },

  async getTeamTimeOff(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/time-off/get-team-time-off?" + stringFilters)
  },

  async getApprovalTimeOff(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/time-off/get-approval-time-off?" + stringFilters
    )
  },

  async getEmployeeTimeOffRequest(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/time-off/get-employee-time-off-request?" + stringFilters
    )
  },

  async getEmployeeTimeOffCarousel(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/time-off/get-employee-time-off-carousel?" + stringFilters
    )
  },

  async getEmployeeTimeOffBalanceHistory(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/time-off/get-employee-time-off-balance-history?" + stringFilters
    )
  },

  async getEmployeeTimeOffConfig(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/time-off/get-employee-time-off-add-adjustment-config?" + stringFilters
    )
  },

  async getEmployeeTimeOffChangeType(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/time-off/get-employee-time-off-change-type?" + stringFilters
    )
  },

  async postEmployeeTimeOffSubmitAdjustment(data) {
    return await axiosApi.post(
      "/time-off/employee-time-off-submit-adjustment",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getSampleFileImport(data) {
    return await axiosApi.get(
      `/import-time-off/get-sample-file-import?type=${data}`,
      {
        responseType: "blob"
      }
    )
  },

  async getFieldsImport(data) {
    return await axiosApi.post(
      `/import-time-off/get-fields-import`,
      serialize(_.cloneDeep(data))
    )
  },

  async getImportData(data) {
    return await axiosApi.post(
      "/import-time-off/get-import-data",
      serialize(_.cloneDeep(data))
    )
  },

  async importTimeOff(data) {
    return await axiosApi.post(
      "/import-time-off/import-time-off",
      serialize(_.cloneDeep(data))
    )
  },

  async getExportExcel(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/time-off/export-excel?" + stringFilters, {
      responseType: "blob"
    })
  },

  async loadCurrentUser() {
    return await axiosApi.get("/time-off/load-current-user")
  },

  async createGoogleAccessToken(params) {
    return await axiosApi.post(
      "/time-off/create-google-access-token",
      serialize(_.cloneDeep(params))
    )
  },

  async toggleSyncGoogleCalendar() {
    return await axiosApi.post("/time-off/toggle-sync-google-calendar")
  }
}

// ** time off setting api
export const SettingTimeOffApi = {
  async getTypeAndPolicy(params) {
    return await axiosApi.get(
      `/time-off-setting/get-type-and-policy?status=${params.status}&name=${params.typeName}`
    )
  },
  async postSaveTypeAndPolicyTimeOff(params) {
    return await axiosApi.post(
      "/time-off-setting/add-type-and-policy-time-off",
      serialize(_.cloneDeep(params)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async postUpdateTypeAndPolicy(id, params) {
    return await axiosApi.post(
      `/time-off-setting/update-type/${id}`,
      serialize(_.cloneDeep(params)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async postUpdatePolicy(id, params) {
    return await axiosApi.post(
      `/time-off-setting/update-policy-time-off/${id}`,
      serialize(_.cloneDeep(params)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async postAssignEligibility(id, data) {
    return await axiosApi.post(
      `/time-off-setting/assign-eligibility/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async postUpdateEligibility(id, data) {
    return await axiosApi.post(
      `/time-off-setting/update-eligibility/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async deleteTimeOffType(id) {
    const pathUrl = `/time-off-setting/time-off-type/${id}`
    return await axiosApi.delete(pathUrl)
  },
  async getHoliday(params) {
    return await axiosApi.get(
      `/time-off-setting/get-holiday?office_id=${params.office_id}&year=${params.year}`
    )
  },
  async postSaveHoliday(data) {
    return await axiosApi.post(
      "time-off-setting/add-holiday",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async postUpdateHoliday(id, data) {
    return await axiosApi.post(
      `time-off-setting/update-holiday/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async postSaveHolidayCountry(data) {
    return await axiosApi.post(
      "time-off-setting/add-holiday-country",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async removeHoliday(id) {
    return await axiosApi.delete(`/time-off-setting/remove-holiday/${id}`)
  },
  async loadListEmployeeEligibilityChange(params) {
    return await axiosApi.get(
      `/time-off-setting/load-list-employee-eligibility-change?group_id=${params.group_id}&policy_id=${params.policy_id}&eligibility_applicable=${params.eligibility_applicable}&first_load=${params.first_load}`
    )
  },
  async loadEmployeeSelect() {
    return await axiosApi.get("time-off-setting/load-employee-select")
  },
  async getDetailTimeOffPolicy(id) {
    return await axiosApi.get(`time-off-setting/get-detail-policy/${id}`)
  }
}
