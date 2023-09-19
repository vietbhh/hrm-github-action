import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { axiosNodeApi } from "../../../@apps/utility/api"

export const userApi = {
  async getProfile() {
    return await axiosApi.get("/user/profile")
  },
  async postUpdate(data) {
    return await axiosApi.post("/user/update", serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },
  async getDocuments(id) {
    return await axiosApi.get("/user/documents")
  },
  async postDocuments(data) {
    return await axiosApi.post(
      "/user/documents",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async deleteDocuments(fileName) {
    const pathUrl = "/user/documents/" + fileName
    return await axiosApi.delete(pathUrl)
  },

  async getRelatedList(relatedName, id) {
    return await axiosApi.get(`/user/related/${relatedName}`, {
      isPaginate: false
    })
  },
  async getRelatedDetail(relatedName, relateId) {
    return await axiosApi.get(`/user/related/${relatedName}/${relateId}`)
  },
  async saveRelated(relatedName, data) {
    return await axiosApi.post(
      `/user/related/${relatedName}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async deleteRelated(relatedName, id, relateId) {
    const pathUrl = `/user/related/${relatedName}/${id}/${relateId}`
    return await axiosApi.delete(pathUrl)
  },

  async changeAvatar(data) {
    return await axiosApi.post("/user/avatar", serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },

  async getUserInfo() {
    return await axiosApi.get("/user/get-user-info")
  },

  async createGoogleAccessToken(params) {
    return await axiosApi.post(
      "/user/create-google-access-token",
      serialize(_.cloneDeep(params))
    )
  },

  async getUserAccessToken() {
    return await axiosApi.get("/user/get-user-access-token")
  },

  async getGoogleAccountInfo() {
    return await axiosApi.get("/user/get-google-account-info")
  },

  async signOutGoogle() {
    return await axiosApi.post("/user/sign-out-google")
  },

  async updateSyncStatus(data) {
    return await axiosApi.post(
      "/user/update-sync-status",
      serialize(_.cloneDeep(data))
    )
  }
}

export const employeesApi = {
  async getList(params) {
    return await defaultModuleApi.getList(
      "employees",
      params,
      "/employees/load"
    )
  },
  async getDetail(identity) {
    return await axiosApi.get("/employees/get/" + identity)
  },
  async getOrgData(parent = 0) {
    return await axiosApi.get("/employees/org-chart/" + parent)
  },
  async postSave(data) {
    return await axiosApi.post("/employees/add", serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },
  async postUpdate(id, data) {
    return await axiosApi.post(
      "/employees/update/" + id,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async rehire(id, data) {
    return await axiosApi.post(
      "/employees/rehire/" + id,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async offboard(id, data) {
    return await axiosApi.post(
      "/employees/offboard/" + id,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async cancelOffboard(id) {
    return await axiosApi.get("/employees/cancel-offboard/" + id)
  },
  async deleteEmployee(id) {
    const pathUrl = `/employees/delete/${id}`
    return await axiosApi.delete(pathUrl)
  },
  async getDocuments(id) {
    return await axiosApi.get("/employees/documents/" + id)
  },
  async postDocuments(id, data) {
    return await axiosApi.post(
      "/employees/documents/" + id,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async deleteDocuments(id, fileName) {
    const pathUrl = "/employees/documents/" + id + "/" + fileName
    return await axiosApi.delete(pathUrl)
  },

  async getRelatedList(relatedName, id) {
    return await axiosApi.get(
      `/employees/related/${relatedName}/${id}?isPaginate=false`,
      {
        isPaginate: false
      }
    )
  },
  async getRelatedDetail(relatedName, id, relateId) {
    return await axiosApi.get(
      `/employees/related/${relatedName}/${id}/${relateId}`
    )
  },
  async saveRelated(relatedName, id, data) {
    return await axiosApi.post(
      `/employees/related/${relatedName}/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async deleteRelated(relatedName, id, relateId) {
    const pathUrl = `/employees/related/${relatedName}/${id}/${relateId}`
    return await axiosApi.delete(pathUrl)
  },
  async changeAvatar(id, data) {
    return await axiosApi.post(
      "/employees/avatar/" + id,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async getConfig() {
    return await axiosApi.get("/employees/config")
  },
  async sendInvite(id, data = {}) {
    return await axiosApi.post(
      "/employees/invite/" + id,
      serialize(_.cloneDeep(data))
    )
  },

  async getExportExcel() {
    return await axiosApi.get("/employees/export-excel", {
      responseType: "blob"
    })
  },

  async postDataPreview(data) {
    return await axiosApi.post(
      "/employees/preview",
      serialize(_.cloneDeep(data))
    )
  },

  async postImportSubmit(data) {
    return await axiosApi.post(
      "/employees/import",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getPayroll(identity) {
    return await axiosApi.get("/employees/payroll/" + identity)
  },
  async deleteEmployeeRecurring(identity) {
    return await defaultModuleApi.delete("employee_recurring", identity)
  },
  async addRecurring(data) {
    return await axiosApi.post(
      "/employees/add-recurring",
      serialize(_.cloneDeep(data))
    )
  },
  async updateRecurring(data) {
    return await axiosApi.post(
      "/employees/update-recurring",
      serialize(_.cloneDeep(data))
    )
  },
  async deleteEmployeeSalary(identity) {
    return await defaultModuleApi.delete("employee_salary", identity)
  },

  async getPayrollByYear(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/employees/payroll-by-year?" + stringFilters)
  },

  async postAddEmployeeView(data) {
    return await axiosApi.post(
      "employees/add-employee-view",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async postUpdateEmployeeView(data) {
    return await axiosApi.post(
      "employees/update-employee-view",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async postDeleteEmployeeView(data) {
    return await axiosApi.post(
      "employees/delete-employee-view",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async postUpdateEmployeeNameView(data) {
    return await axiosApi.post(
      "employees/update-employee-view-name",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getSetACtiveEmployeeView(key) {
    return await axiosApi.get("employees/set-active-employee-view?key=" + key)
  },

  async getSettingColumnTable() {
    return await axiosApi.get("/employees/get-setting-column-table")
  },

  async postSaveSettingColumnTable(data) {
    return await axiosApi.post(
      "/employees/save-setting-column-table",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async postUpdateEmployeeUserMetas(data) {
    return await axiosApi.post(
      "/employees/update-employee-user-metas",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async addCustomField(data) {
    return await axiosApi.post(
      "/employees/add-custom-field",
      serialize(_.cloneDeep(data))
    )
  },

  async loadTabContent(tab) {
    return await axiosApi.get(`/employees/load-tab-content?tab=${tab}`)
  },

  async loadCustomFieldDetail(id) {
    return await axiosApi.post(`/employees/load-custom-field-detail/${id}`)
  },

  async updateCustomField(id, data) {
    return await axiosApi.post(
      `/employees/update-custom-field/${id}`,
      serialize(_.cloneDeep(data))
    )
  },

  async deleteCustomField(id) {
    return await axiosApi.post(`/employees/delete-custom-field/${id}`)
  },

  async loadAutoGenerateCode(module, field) {
    return await axiosApi.get(
      `/employees/load-auto-generate-code?module=${module}&field=${field}`
    )
  },

  async updateAutoGenerateCode(id, data) {
    return await axiosApi.post(
      `/employees/update-auto-generate-code/${id}`,
      serialize(_.cloneDeep(data))
    )
  },
  async updateEmployeeStatus(id, data) {
    return await axiosApi.post(
      `/employees/update-employee-status/${id}`,
      serialize(_.cloneDeep(data)),
      {
        disableLoading: true
      }
    )
  },
  async getOverViewEmployee() {
    return await axiosApi.get("/employees/get-over-view-employee", {
      disableLoading: true
    })
  }
}

export const departmentApi = {
  async createDepartmentWorkspace(id) {
    return await axiosNodeApi.get(
      "/employees/create-department-workgroup/" + id
    )
  },
  async postSave(data) {
    return await axiosApi.post(
      "/departments/add",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async updateParent(id, parent) {
    return await axiosApi.post(
      "/departments/update-parent",
      serialize(_.cloneDeep({ id: id, parent: parent })),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async loadData(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/departments/load-data?" + stringFilters)
  },

  async changeDepartment(data) {
    return await axiosApi.post(
      "/departments/update-employee",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async deleteDepartment(data) {
    return await axiosApi.post(
      "/departments/delete-department",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  }
}

export const InsuranceApi = {
  async getConfig() {
    return await axiosApi.get("/insurance/get-config")
  },

  async getTable(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/insurance/get-table?" + stringFilters)
  },

  async getTableProfile(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/insurance/get-table-profile?" + stringFilters)
  }
}

export const EmployeeSettingApi = {
  async createEmployeeType(data) {
    return await axiosApi.post(
      "/employee-settings/create-employee-type",
      serialize(_.cloneDeep(data))
    )
  },
  async loadEmployeeType() {
    return await axiosApi.get("/employee-settings/load-employee-type")
  },
  async updateEmployeeType(id, data) {
    return await axiosApi.post(
      `/employee-settings/update-employee-type/${id}`,
      serialize(_.cloneDeep(data))
    )
  },
  async deleteEmployeeType(id) {
    return await axiosApi.post(`/employee-settings/delete-employee-type/${id}`)
  },
  async createContractType(data) {
    return await axiosApi.post(
      "/employee-settings/create-contract-type",
      serialize(_.cloneDeep(data))
    )
  },
  async loadContractType() {
    return await axiosApi.get("/employee-settings/load-contract-type")
  },
  async updateContractType(id, data) {
    return await axiosApi.post(
      `/employee-settings/update-contract-type/${id}`,
      serialize(_.cloneDeep(data))
    )
  },
  async deleteContractType(id) {
    return await axiosApi.post(`/employee-settings/delete-contract-type/${id}`)
  }
}
