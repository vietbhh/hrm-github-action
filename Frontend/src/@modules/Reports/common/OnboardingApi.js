import { axiosApi } from "@apps/utility/api"
import { erpSelectToValues, object2QueryString } from "@apps/utility/handleData"

export const ReportOnboardingApi = {
  async getOnboarding(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/reports-onboarding/get-onboarding?" + stringFilters
    )
  },

  async getExportExcel(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/reports-onboarding/export-excel?" + stringFilters,
      {
        responseType: "blob"
      }
    )
  }
}

export const ReportOffboardingApi = {
  async getOffboarding(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/reports-offboarding/get-offboarding?" + stringFilters
    )
  },

  async getExportExcel(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/reports-offboarding/export-excel?" + stringFilters,
      {
        responseType: "blob"
      }
    )
  }
}

export const ReportEmployeeTurnoverRateApi = {
  async getEmployeeTurnoverRate(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/reports-employee-turnover-rate/get-employee-turnover-rate?" +
        stringFilters
    )
  },

  async getExportExcel(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/reports-employee-turnover-rate/export-excel?" + stringFilters,
      {
        responseType: "blob"
      }
    )
  }
}
