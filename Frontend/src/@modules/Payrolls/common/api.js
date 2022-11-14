import { axiosApi } from "@apps/utility/api"
import { defaultModuleApi } from "@apps/utility/moduleApi"

import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const payrollsSettingApi = {
  async loadData(filters = {}) {
    return await defaultModuleApi.getList("pay_cycles", filters)
  },
  async info(id) {
    return await defaultModuleApi.getDetail("pay_cycles", id)
  },
  async save(data) {
    return await defaultModuleApi.postSave("pay_cycles", data)
  },
  async delete(id) {
    return await axiosApi.post(
      "payrolls-settings/delete-paycycle",
      serialize(_.cloneDeep({ id: id }))
    )
  },
  async saveGeneral(data) {
    return await axiosApi.post(
      "/payrolls-settings/save-general",
      serialize(_.cloneDeep({ data }))
    )
  },

  async lastAttendance() {
    return await axiosApi.get("/payrolls-settings/last-payroll")
  },
  async saveRecurring(data) {
    return await defaultModuleApi.postSave("recurring", data)
  },
  async loadRecurring(filters = {}) {
    return await defaultModuleApi.getList("recurring", filters)
  },
  async infoRecurring(id) {
    return await defaultModuleApi.getDetail("recurring", id)
  },
  async deleteRecurring(id) {
    return await defaultModuleApi.delete("recurring", id)
  }
}

export const PayrollApi = {
  async getConfig() {
    return await axiosApi.get("/payrolls/get-config")
  },

  async getPayrollTable(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/payrolls/get-payroll-table?" + stringFilters)
  },

  async getPayrollDetail(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/payrolls/get-payroll-detail?" + stringFilters)
  },

  async postEditOneOff(data) {
    return await axiosApi.post(
      "payrolls/edit-one-off",
      serialize(_.cloneDeep(data))
    )
  },

  async postDeleteOneOff(data) {
    return await axiosApi.post(
      "payrolls/delete-one-off",
      serialize(_.cloneDeep(data))
    )
  },

  async postEditOvertime(data) {
    return await axiosApi.post(
      "payrolls/edit-overtime",
      serialize(_.cloneDeep(data))
    )
  },

  async postEditOvertimeOffCycleOffset(data) {
    return await axiosApi.post(
      "payrolls/edit-off-cycle-offset-overtime",
      serialize(_.cloneDeep(data))
    )
  },

  async getClosePayroll(payroll) {
    return await axiosApi.get("/payrolls/close-payroll/" + payroll)
  },

  async getExportExcel(payroll) {
    return await axiosApi.get("/payrolls/export-excel/" + payroll, {
      responseType: "blob"
    })
  },

  async postSendPayslip(data) {
    return await axiosApi.post(
      "payrolls/send-payslip",
      serialize(_.cloneDeep(data))
    )
  }
}

export const payrollsImportApi = {
  async getExportTemplate(import_type) {
    return await axiosApi.get(
      "/payrolls-import/export-template?type=" + import_type,
      {
        disableLoading: true,
        responseType: "blob"
      }
    )
  },

  async postDataPreview(data) {
    return await axiosApi.post(
      "/payrolls-import/preview",
      serialize(_.cloneDeep(data))
    )
  },

  async postImport(data) {
    return await axiosApi.post(
      "/payrolls-import/import",
      serialize(_.cloneDeep(data))
    )
  }
}
