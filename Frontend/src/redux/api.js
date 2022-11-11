import { axiosApi } from "@apps/utility/api"

export const updateUserSetting = async (name, value) => {
  const formData = new FormData()
  formData.append("value", value)
  return await axiosApi.post("/user/setting/" + name, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

export const updateTest = (name, value) => {
  return name
}
