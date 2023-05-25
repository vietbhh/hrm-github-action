import { useMergedState } from "@apps/utility/common"
import CreatePost from "@src/components/hrm/CreatePost/CreatePost"
import LoadFeed from "./LoadFeed"
import { useSelector } from "react-redux"
import { feedApi } from "../common/api"
import { useEffect } from "react"

const FeedCreateAndLoad = (props) => {
  const {
    workspace = [], // arr workspace: []
    apiLoadFeed = null, // api load feed
    paramsLoadFeed = {}, // add param load feed api
    approveStatus = "approved", // approved / rejected / pending
    customAction = {} // custom dropdown post header
  } = props
  const [state, setState] = useMergedState({
    dataCreateNew: {},

    // ** event
    options_employee_department: [],
    optionsMeetingRoom: []
  })

  const dataEmployee = useSelector((state) => state.users.list)

  // ** function
  const setDataCreateNew = (value) => {
    setState({ dataCreateNew: value })
  }

  // ** useEffect
  useEffect(() => {
    const data_options = []
    _.forEach(dataEmployee, (item) => {
      data_options.push({
        value: `${item.id}_employee`,
        label: item.full_name,
        avatar: item.avatar
      })
    })
    feedApi
      .getGetInitialEvent()
      .then((res) => {
        _.forEach(res.data.dataDepartment, (item) => {
          data_options.push({
            value: `${item.id}_department`,
            label: item.name,
            avatar: ""
          })
        })

        setState({
          options_employee_department: data_options,
          optionsMeetingRoom: res.data.dataMeetingRoom
        })
      })
      .catch((err) => {
        setState({
          options_employee_department: data_options,
          optionsMeetingRoom: []
        })
      })
  }, [])

  return (
    <div className="feed">
      <CreatePost
        setDataCreateNew={setDataCreateNew}
        workspace={workspace}
        approveStatus={approveStatus}
        options_employee_department={state.options_employee_department}
        optionsMeetingRoom={state.optionsMeetingRoom}
      />

      <LoadFeed
        dataCreateNew={state.dataCreateNew}
        setDataCreateNew={setDataCreateNew}
        workspace={workspace}
        apiLoadFeed={apiLoadFeed}
        customAction={customAction}
        paramsLoadFeed={paramsLoadFeed}
        options_employee_department={state.options_employee_department}
        optionsMeetingRoom={state.optionsMeetingRoom}
      />
    </div>
  )
}

export default FeedCreateAndLoad
