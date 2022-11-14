import { axiosApi } from "@apps/utility/api"
import {
  serialize,
  erpSelectToValues,
  object2QueryString
} from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"
export const testApi = {
  async saveTest(
    data,
    candidate,
    idtest,
    resultTest = "",
    typeUserTest,
    typeTest
  ) {
    return await axiosApi.post(
      "/test/done-test",
      serialize(
        _.cloneDeep({
          data: data,
          idtest: idtest,
          candidate: candidate,
          resultTest: resultTest,
          typeUserTest: typeUserTest,
          typeTest: typeTest
        })
      )
    )
  },
  async getQuestion(id) {
    return await axiosApi.get("/test/detail/" + id)
  },
  async postImport(data, id = 0) {
    return await axiosApi.post(
      "/test/import",
      serialize(_.cloneDeep({ data: data, test: id }))
    )
  },
  async getTest(filters = {}) {
    return await defaultModuleApi.getList("test", { filters: filters })
  },
  async getTestHistory(filters = {}) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(filters))
    )
    return await axiosApi.get("/test/load-data-test?" + stringFilters)
  }
}
