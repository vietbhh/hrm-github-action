import { axiosApi } from "@apps/utility/api";
import { serialize } from "@apps/utility/handleData";
import { defaultModuleApi } from "@apps/utility/moduleApi";

export const ChecklistApi = {
  async getList(params) {
    return await defaultModuleApi.getList(
      "checklist_template",
      params,
      "/checklist/load-template"
    );
  },
  async postSave(data) {
    return await axiosApi.post("/checklist/add", serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  async updateCheklist(id, data) {
    return await axiosApi.post(
      `/checklist/update/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },
  async deleteChecklist(id) {
    const pathUrl = `/checklist/delete/${id}`;
    return await axiosApi.delete(pathUrl);
  },
  async getDetailChecklist(id) {
    return await axiosApi.get(`/checklist/detail/${id}`);
  },
  async postSaveTask(idChecklist, data) {
    return await axiosApi.post(
      `/checklist/add-task/${idChecklist}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },
  async postUpdateTask(id, data) {
    return await axiosApi.post(
      `/checklist/update-task/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },
  async deleteTask(id) {
    const pathUrl = `/checklist/delete-task/${id}`;
    return await axiosApi.delete(pathUrl);
  },
  async getDataTaskList(params) {
    return await defaultModuleApi.getList(
      "checklist",
      params,
      "/checklist/load-checklist"
    );
  },
  async postSaveAssignChecklist(data) {
    return await axiosApi.post(
      "/checklist/assign-checklist",
      serialize(_.cloneDeep(data)),
      {
        header: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },
  async postCompleteChecklistDetail(data) {
    return await axiosApi.post(
      "/checklist/complete-checklist-detail",
      serialize(_.cloneDeep(data)),
      {
        header: {
          "content-Type": "multipart/form-data"
        }
      }
    );
  },
  async postRevertChecklistDetail(data) {
    return await axiosApi.post(
      "/checklist/revert-checklist-detail",
      serialize(_.cloneDeep(data)),
      {
        header: {
          "content-Type": "multipart/form-data"
        }
      }
    );
  },
  async postUpdateChecklistDetail(id, data) {
    return await axiosApi.post(
      `/checklist/update-checklist-detail/${id}`,
      serialize(_.cloneDeep(data)),
      {
        header: {
          "content-Type": "multipart/form-data"
        }
      }
    );
  },
  async postCompleteChecklist(id, data) {
    return await axiosApi.post(
      `checklist/complete-checklist/${id}`,
      serialize(_.cloneDeep(data)),
      {
        header: {
          "content-Type": "multipart/form-data"
        }
      }
    );
  },
  async postUpdateChecklist(id, data) {
    return await axiosApi.post(
      `checklist/update-checklist/${id}`,
      serialize(_.cloneDeep(data)),
      {
        header: {
          "content-Type": "multipart/form-data"
        }
      }
    );
  },
  async getListToDo(params) {
    return await defaultModuleApi.getList(
      "checklist",
      params,
      "/checklist/get-list-todo"
    );
  },
  async deleteChecklistDetail(checklistId, checklistDetailId) {
    const pathUrl = `/checklist/delete-checklist-detail/${checklistId}/${checklistDetailId}`;
    return await axiosApi.delete(pathUrl);
  },
  async getChecklistEmployeeInfo(employeeId) {
    const pathUrl = `/checklist/get-checklist-employee-info/${employeeId}`;
    return await axiosApi.get(pathUrl);
  },
  async getChecklistDetailInfo(id) {
    return await axiosApi.get(`/checklist/get-checklist-detail-info/${id}`)
  },
  async completeMultiChecklistDetail(data) {
    return await axiosApi.post("/checklist/complete-multi-checklist-detail", serialize(_.cloneDeep(data)))
  }
};
