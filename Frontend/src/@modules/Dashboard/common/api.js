import { axiosApi } from "@apps/utility/api"
import { object2QueryString, serialize } from "@apps/utility/handleData"

export const DashboardApi = {
  async getDashboard() {
    return await axiosApi.get("/dashboard/get-dashboard")
  },

  async postSaveWidget(data) {
    return await axiosApi.post(
      "/dashboard/save-widget",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getDob() {
    return await axiosApi.get("/dashboard/get-dob", {
      disableLoading: true
    })
  },

  async getDataAttendance() {
    return await axiosApi.get("/dashboard/get-data-attendance", {
      disableLoading: true
    })
  },

  async getDataOff() {
    return await axiosApi.get("/dashboard/get-data-off", {
      disableLoading: true
    })
  },

  async getDataMyTimeOff() {
    return await axiosApi.get("/dashboard/get-data-my-time-off", {
      disableLoading: true
    })
  },

  async getDataCheckList() {
    return await axiosApi.get("/dashboard/get-data-check-list", {
      disableLoading: true
    })
  },

  async getDataPendingApproval() {
    return await axiosApi.get("/dashboard/get-data-pending-approval", {
      disableLoading: true
    })
  },

  async getUpdateLoadingDashboard() {
    return await axiosApi.get("/dashboard/update-loading-dashboard", {
      disableLoading: true
    })
  },

  async getDepartment() {
    return await axiosApi.get("/dashboard/get-department")
  },

  async getAttendanceSetting() {
    return await axiosApi.get("/dashboard/get-attendance-setting")
  },

  async getAttendanceToday() {
    return await axiosApi.get("/dashboard/get-attendance-today")
  },

  async updateShowDepartment(data) {
    return await axiosApi.post(
      "/dashboard/update-view-department",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async getStatisticData(params) {
    const strParam = object2QueryString(params)
    return await axiosApi.get(`/dashboard/get-statistic-data?get${strParam}`, {
      disableLoading: true
    })
  }
}
