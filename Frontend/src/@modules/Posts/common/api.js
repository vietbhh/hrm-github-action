import { axiosNodeApi } from "@apps/utility/api"
import { object2QueryString } from "@apps/utility/handleData"

export const postApi = {
    async getPostInteractiveMember(id, params) {
        const strParams = object2QueryString(params)

        return await axiosNodeApi.get(`/feed/get-post-interactive-member/${id}?${strParams}`)
    }
}