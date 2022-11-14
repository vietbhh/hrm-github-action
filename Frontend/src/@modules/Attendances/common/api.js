import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"

export const attendanceSettingApi = {
  async getData() {
    return await axiosApi.get("/attendances-setting/load-data")
  },
  async infoAttendance(idOffices) {
    return await axiosApi.get(
      "/attendances-setting/info-attendance/" + idOffices
    )
  },
  async infoGeneral() {
    return await axiosApi.get("/attendances-setting/info-general")
  },
  async save(data) {
    return await defaultModuleApi.postSave("attendance_setting", data)
  },
  // fff info-attendance
  async saveGeneral(data) {
    return await axiosApi.post(
      "/attendances-setting/general-save",
      serialize(_.cloneDeep({ data }))
    )
  }
}

export const MyAttendanceApi = {
  async getMyAttendance() {
    return await axiosApi.get(`attendances/load-my-attendance`, {
      disableLoading: true
    })
  },
  async addNewAttendanceLog(data) {
    return await axiosApi.post(
      "attendances/add-attendance-log",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async editAttendanceDetailPaidTime(id, data) {
    return await axiosApi.post(
      `attendances/edit-attendance-detail-paid-time/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async editAttendanceDetailOvertime(id, data) {
    return await axiosApi.post(
      `attendances/edit-attendance-detail-overtime/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async getEmployeeAttendance(params) {
    let getUrl = `attendances/load-employee-attendance?employee_id=${params.employeeId}`
    if (params.hasOwnProperty("attendanceId")) {
      getUrl += `&attendance_id=${params.attendanceId}`
    }
    if (params.hasOwnProperty("status")) {
      getUrl += `&status=${params.status}`
    }
    if (params.hasOwnProperty("location")) {
      getUrl += `&location=${params.location}`
    }
    if (params.hasOwnProperty("records")) {
      getUrl += `&records=${params.records}`
    }
    return await axiosApi.get(getUrl)
  },
  async getAttendanceDetailLog(params) {
    return await axiosApi.get(
      `attendances/load-attendance-detail-log?attendance_detail_id=${params.attendanceDetailId}`
    );
  },
  async getListAttendanceForFilter() {
    return await axiosApi.get('attendances/get-list-attendance-for-filter')
  }
}
